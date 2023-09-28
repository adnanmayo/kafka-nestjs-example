import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class ProducerService implements OnModuleInit, OnModuleDestroy {
  producer;
  kafkaClient;
  consumer;

  constructor() {
    this.kafkaClient = new Kafka({
      clientId: '1-client',
      brokers: ['kafka:9092'],
    });
    this.producer = this.kafkaClient.producer();
  }

  async onModuleInit() {
    await this.connect();
  }

  async connect(): Promise<void> {
    await this.producer.connect({
      groupId: 'AVA_SERVICE',
    });
  }

  async onModuleDestroy() {
    await this.producer.close();
  }

  async publish(pattern: string, message: string) {
    return this.producer.send({
      topic: pattern,
      messages: [
        {
          value: message,
        },
      ],
    });
  }
}
