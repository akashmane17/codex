const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw Error(`Missing String environment variable for ${key}`);
  }

  return value;
};
// "redis://localhost:6379"
export const NODE_ENV = getEnv("NODE_ENV", "development");
export const PORT = getEnv("PORT", "5001");
export const REDIS_URL = getEnv("REDIS_URL");
export const MONGO_URI = getEnv("MONGO_URI");

export const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || "codex";
export const KAFKA_BROKERS = (
  process.env.KAFKA_BROKERS || "localhost:9092"
).split(",");
export const KAFKA_TOPIC = process.env.KAFKA_TOPIC || "codex-document";


// export const APP_ORIGIN = getEnv("APP_ORIGIN");
// export const JWT_SECRET = getEnv("JWT_SECRET");
// export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
