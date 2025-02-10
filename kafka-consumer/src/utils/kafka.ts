import { Kafka, Consumer, EachMessagePayload } from "kafkajs";

class KafkaConsumer {
  private kafka: Kafka;
  private consumer: Consumer;
  private readonly topic: string;
  private readonly groupId: string;

  constructor(
    clientId: string,
    brokers: string[],
    topic: string,
    groupId: string
  ) {
    this.kafka = new Kafka({ clientId, brokers });
    this.consumer = this.kafka.consumer({ groupId });
    this.topic = topic;
    this.groupId = groupId;
  }

  // Connect the consumer
  async connect(): Promise<void> {
    try {
      await this.consumer.connect();
      console.log(
        `Kafka consumer connected successfully (Group ID: ${this.groupId})`
      );

      // Subscribe to the topic
      await this.consumer.subscribe({ topic: this.topic, fromBeginning: true });
      console.log(`Subscribed to topic: ${this.topic}`);
    } catch (error) {
      console.error("Failed to connect Kafka consumer:", error);
      throw new Error("Kafka consumer connection failed");
    }
  }

  // Process messages from the topic
  async consume(
    processMessage: (payload: EachMessagePayload) => Promise<void>
  ): Promise<void> {
    try {
      await this.consumer.run({
        eachMessage: async (payload: EachMessagePayload) => {
          try {
            console.log(
              `Received message from topic: ${payload.topic}, partition: ${payload.partition}`
            );
            await processMessage(payload);
          } catch (processingError) {
            console.error("Error processing message:", processingError);
          }
        },
      });
    } catch (error) {
      console.error("Failed to consume messages:", error);
      throw new Error("Kafka message consumption failed");
    }
  }

  // Disconnect the consumer
  async disconnect(): Promise<void> {
    try {
      await this.consumer.disconnect();
      console.log("Kafka consumer disconnected successfully");
    } catch (error) {
      console.error("Failed to disconnect Kafka consumer:", error);
    }
  }
}

export default KafkaConsumer;
