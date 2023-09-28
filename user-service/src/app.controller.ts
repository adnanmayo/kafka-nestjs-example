import {
  Controller,
  Get,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import {
  Client,
  // ClientKafka,
  Transport,
  ServerKafka,
} from '@nestjs/microservices';
import { AppService } from './app.service';
// import { KafkaService } from './kafka/kafka.service';
import { ProducerService } from './kafka/producer.service';
// import { ProducerService } from './kafka/producer.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly producerService: ProducerService,
  ) {}

  // @Client({
  //   transport: Transport.KAFKA,
  //   options: {
  //     // producerOnlyMode: true,
  //     client: {
  //       clientId: '1',
  //       brokers: ['kafka:9092'],
  //     },

  //     consumer: {
  //       groupId: 'my-kafka-consumer', // Should be the same thing we give in consumer

  //     },
  //   },
  // })
  // client: ClientKafka;

  // async onModuleInit() {
  //   // Need to subscribe to topic
  //   // so that we can get the response from kafka microservice
  //   // this.client.subscribeToResponseOf('my-first-testing');
  //   await this.client.connect();
  // }

  // async onModuleDestroy() {
  // //  await this.client.close();
  // }

  @Get('/testing')
  getHello() {
    return this.producerService.publish(
      'my-first-testing',
      'Testing',
    ); // args - topic, message
  }
}
