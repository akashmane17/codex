import "dotenv/config";
import express from "express";
import { PORT } from "./constants/env";
import KafkaConsumer from "./utils/kafka";
import connectToMongoDB from "./config/db";
import { saveRoomMap } from "./services/room.service";

const app = express();
const port = PORT;

const latestRoomIdCode = new Map<string, string>();
const SAVE_INTERVAL = 60000; // Time in ms to save data to the database
const BUFFER_SIZE = 100;

const kafkaConsumer = new KafkaConsumer(
  "codex",
  ["localhost:9092"],
  "codex-document",
  "codex-group"
);

async function processMessage(payload: {
  topic: string;
  partition: number;
  message: any;
}) {
  try {
    const { topic, partition, message } = payload;

    const msg = JSON.parse(message.value.toString());

    console.log(
      `Processing message from topic: ${topic}, partition: ${partition}, Message: ${msg.roomId}`
    );

    latestRoomIdCode.set(msg.roomId, msg.code);
  } catch (error) {
    console.log("Error processing the kafka message: ", error);
  }
}

const scheduleSave = async () => {
  if (latestRoomIdCode.size > 0) {
    try {
      await saveRoomMap(latestRoomIdCode);
      latestRoomIdCode.clear();
    } catch (error) {
      console.error("Error during schedule save:", error);
    }
  }
};

setInterval(scheduleSave, SAVE_INTERVAL);

// Graceful Shutdown
async function cleanup() {
  console.log("Cleaning up resources...");
  await scheduleSave();
  await kafkaConsumer.disconnect();
  process.exit(0);
}

process.on("SIGINT", cleanup); // Handle Ctrl+C
process.on("SIGTERM", cleanup); // Handle kill command

async function initializeServer() {
  try {
    await connectToMongoDB();
    await kafkaConsumer.connect();
    await kafkaConsumer.consume(processMessage);

    app.listen(port, () => {
      console.log(`Consumer Service running on port ${port}`);
    });
  } catch (error) {
    console.error("Initialization error:", error);
    process.exit(1); // Exit process if critical services fail
  }
}

// Middleware for parsing JSON
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Consumer service is working...");
});

// Start Initialization
initializeServer();
