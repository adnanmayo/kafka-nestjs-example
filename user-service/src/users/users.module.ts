import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities';
import { KafkaModule } from './../kafka/kafka.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), KafkaModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

