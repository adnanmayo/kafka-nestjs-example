import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
// import { KafkaModule } from './kafka/kafka.module';
// import ProducerService from './kafka/producer.service';
// import ConsumerService from './kafka/consumer.service';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { KafkaModule } from './kafka/kafka.module';
import { ProducerService } from './kafka/producer.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (env: ConfigService) => ({
        type: 'postgres',
        host: env.get('DB_HOST'),
        port: env.get('DB_PORT'),
        username: env.get('DB_USER'),
        password: env.get('DB_PASS'),
        database: env.get('DB_NAME'),
        // seeds: ['database/seeds/**/*{.ts,.js}'],
        // factories: ['database/factories/**/*{.ts,.js}'],
        entities: ['dist/**/*.entity{.ts,.js}'], //[env.get('TYPE_ORM_ENTITIES')],
        synchronize: true,
        logging: Boolean(env.get('DB_DEBUG')),
        logger: 'file',
      }),
    }),
    UsersModule,
    KafkaModule,
    
  ],
  // exports: [ClientKafka],
  controllers: [AppController],
  providers: [AppService, ProducerService],
})
export class AppModule {}
