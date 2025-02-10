import { createClient } from "redis";
import { REDIS_URL } from "../constants/env";

// Create a Redis client
const RedisClient = createClient({
  url: REDIS_URL, // Replace localhost with your Docker host IP if needed
});

export const setDocumentToRedis = async (roomId: string, code: string) => {
  try {
    await RedisClient.set(roomId, code);
    return true;
  } catch (error) {
    return false;
  }
};

export const getDocumentFromRedis = async (roomId: string) => {
  try {
    const data = await RedisClient.get(roomId);
    return data;
  } catch (error) {
    return null;
  }
};

export const redisData = async () => {
  try {
    const keys = await RedisClient.keys("*");

    for (const key of keys) {
      const value = await RedisClient.get(key);
      console.log(`Key: ${key}, Value: ${value}`);
    }
  } catch (error: any) {
    console.error("Error fetching redis data: ", error);
  }
};

export default RedisClient;
