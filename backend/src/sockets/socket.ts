import { Server } from "socket.io";
import http from "http";
import express from "express";
import { getDocumentFromRedis, setDocumentToRedis } from "../utils/redisClient";

import { kafkaProducer } from "..";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3000",
      "http://192.168.1.113:5173/",
    ],
    methods: ["GET", "POST"],
  },
});

const DEBOUNCE_INTERVAL = 500; // Time in ms to debounce updates per room

// Store debounce timers for each room (roomId, Timeout)
const roomTimers: Record<string, NodeJS.Timeout> = {};

// Helper function to emit errors
const emitError = (socket: any, message: string) => {
  socket.emit("error", { message });
};

// Helper function to handle Redis operation
const handleRedisOperation = async (roomId: string, code: string) => {
  await setDocumentToRedis(roomId, code);
};

// Creating a socket connection
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  /**
   * USER JOINS THE ROOM
   * when a new user comes, add that user in room using room id
   */
  socket.on(
    "join",
    async ({ roomId, username }: { roomId: string; username: string }) => {
      console.log(`${username} joined room: ${roomId}`);

      if (!roomId || !username) {
        return emitError(socket, "Invalid room or username");
      }

      try {
        socket.join(roomId);

        // get existing document from redis
        const storedCode = await getDocumentFromRedis(roomId);

        // Emit the document to the newly join users
        socket.emit("code-sync", { roomId, code: storedCode || "" });

        // Notify other users in the room
        io.to(roomId).emit("joined", { username, roomId });
      } catch (error) {
        console.error("Error in join event:", error);
        emitError(socket, "Failed to join the room");
      }
    }
  );

  /**
   * CODE CHANGE
   * handles code change event
   * Called either from client or inside code-sync event
   * Emit the updated changes to all the users in the room
   * Asynchronously save the data to redis, and send over kafka
   */
  socket.on(
    "code-change",
    async ({ roomId, code }: { roomId: string; code: string }) => {
      try {
        if (!roomId || typeof code !== "string") {
          emitError(socket, "Invalid Data");
        }

        // Debounce updates
        if (roomTimers[roomId]) {
          clearTimeout(roomTimers[roomId]);
        }

        // Broadcast the latest code to all users in the room
        socket.to(roomId).emit("code-change", { code });

        roomTimers[roomId] = setTimeout(async () => {
          try {
            // store updated document in redis
            await handleRedisOperation(roomId, code);

            // send the same document to the kafka
            const message = { roomId, code };
            await kafkaProducer.sendMessage(message);
          } catch (error) {
            console.error(
              `Error processing code-change for room ${roomId}:`,
              error
            );
          }
        }, DEBOUNCE_INTERVAL);
      } catch (error) {
        console.error("Error in code-change event:", error);
      }
    }
  );

  /**
   * INITIAL CODE SYNC
   * when user refresh the page or new user joins
   * fetch the code from redis and send
   */
  socket.on(
    "code-sync",
    async ({ roomId, code }: { roomId: string; code: string }) => {
      try {
        if (!roomId) {
          return socket.emit("error", { message: "Invalid data" });
        }

        const storeCode = await getDocumentFromRedis(roomId); // fetch from redis
        const codeToSend = code || storeCode;

        socket.emit("code-change", { roomId, code: codeToSend });
      } catch (error) {
        console.error("Error in code-sync event:", error);
      }
    }
  );

  // Disconnect Event
  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

export { app, io, server };
