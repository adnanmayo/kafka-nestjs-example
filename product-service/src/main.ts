import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // const microservice = app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.KAFKA,
  //   options: {
  //     client: {
  //       clientId: '1',
  //       brokers: ['kafka:9092'],
  //     },
  //     consumer: {
  //       groupId: 'my-kafka-consumer', // Should be the same thing we give in consumer
  //     },
  //   }
  // });


  const config = new DocumentBuilder()
    .setTitle('Product Service')
    .setDescription('The Product Service')
    .setVersion('1.0')
    .addBearerAuth()

    .build();


  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();
  await app.listen(configService.get<number>('PRODUCT_SERVICE_PORT'));

}

bootstrap();
