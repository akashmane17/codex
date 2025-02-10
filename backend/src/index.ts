import "dotenv/config";
import express from "express";
import {
  KAFKA_BROKERS,
  KAFKA_CLIENT_ID,
  KAFKA_TOPIC,
  PORT,
} from "./constants/env";
import { app, server } from "./sockets/socket";
import RedisClient from "./utils/redisClient";
import KafkaProducer from "./utils/kafka";

// Environment Variables
const port = PORT;
const kafkaClientId = KAFKA_CLIENT_ID;
const kafkaBrokers = KAFKA_BROKERS;
const kafkaTopic = KAFKA_TOPIC;

// Kafka Producer Instance
export const kafkaProducer = new KafkaProducer(
  kafkaClientId,
  kafkaBrokers,
  kafkaTopic
);

async function initializeServer() {
  try {
    // Connect Redis
    await RedisClient.connect();
    console.log("Connected to Redis");

    // Connect Kafka
    await kafkaProducer.connect();
    console.log("Kafka Producer connected");

    // Start Express Server
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Initialization error:", error);
    process.exit(1); // Exit process if critical services fail
  }
}

// Graceful Shutdown
async function cleanup() {
  console.log("Cleaning up resources...");
  await kafkaProducer.disconnect();
  await RedisClient.disconnect();
  process.exit(0);
}

process.on("SIGINT", cleanup); // Handle Ctrl+C
process.on("SIGTERM", cleanup); // Handle kill command

// Middleware for parsing JSON
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Server is working...");
});

// Start Initialization
initializeServer();
