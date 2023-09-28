import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const microservice = app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: '1-order-service',
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'AVA_ORDER_SERVICE', 
      },
    }
  });



  const config = new DocumentBuilder()
    .setTitle('Order Service')
    .setDescription('The Order Service')
    .setVersion('1.0')
    .addBearerAuth()

    .build();


  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.startAllMicroservices();
  await app.listen(configService.get<number>('ORDER_SERVICE_PORT'));

}

bootstrap();
