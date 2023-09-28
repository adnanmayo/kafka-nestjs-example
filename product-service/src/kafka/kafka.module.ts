import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';


@Module({
  providers: [ProducerService],
  exports: [ProducerService],
  controllers: [],
  imports: [
  ],
})
export class KafkaModule {}
