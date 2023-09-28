import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: '1',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'AVA_ORDER_SERVICE', 
      },
    }
  });


  const config = new DocumentBuilder()
    .setTitle('User Service')
    .setDescription('The User Service')
    .setVersion('1.0')
    .addBearerAuth()

    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({}));
  await app.startAllMicroservices();
  await app.listen(configService.get<number>('USER_SERVICE_PORT'));
}

bootstrap();
