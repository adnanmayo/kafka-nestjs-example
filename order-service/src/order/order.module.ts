import { KafkaModule } from './../kafka/kafka.module';
import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
    ]),
    KafkaModule
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule { }
