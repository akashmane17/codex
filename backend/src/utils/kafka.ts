import { Kafka, Producer } from "kafkajs";

class KafkaProducer {
  private kafka: Kafka;
  private producer: Producer;
  private readonly topic: string;

  constructor(clientId: string, brokers: string[], topic: string) {
    this.kafka = new Kafka({ clientId, brokers });
    this.producer = this.kafka.producer();
    this.topic = topic;
  }

  // Connect the producer
  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      console.log("Kafka producer connected successfully");
    } catch (error) {
      console.error("Failed to connect Kafka producer:", error);
      throw new Error("Kafka producer connection failed");
    }
  }

  // Send a message to the Kafka topic
  async sendMessage(message: { roomId: string; code: string }): Promise<void> {
    try {
      await this.producer.send({
        topic: this.topic,
        messages: [{ value: JSON.stringify(message) }],
      });
      console.log("Message sent successfully to Kafka");
    } catch (error) {
      console.error("Failed to send message to Kafka:", error);
      throw new Error("Kafka message send failed");
    }
  }

  // Send a message to the Kafka topic
  async sendMessages(
    messages: { roomId: string; code: string }[]
  ): Promise<void> {
    try {
      await this.producer.send({
        topic: this.topic,
        messages: [{ value: JSON.stringify(messages) }],
      });
      console.log("Messages sent successfully to Kafka");
    } catch (error) {
      console.error("Failed to send messages to Kafka:", error);
      throw new Error("Kafka message send failed");
    }
  }

  // Disconnect the producer
  async disconnect(): Promise<void> {
    try {
      await this.producer.disconnect();
      console.log("Kafka producer disconnected successfully");
    } catch (error) {
      console.error("Failed to disconnect Kafka producer:", error);
    }
  }
}

export default KafkaProducer;
