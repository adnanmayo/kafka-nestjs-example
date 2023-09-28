import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
// import ProducerService from './kafka/producer.service';
import { log } from 'console';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,

    // @Inject(ProducerService)
    // private readonly producerService: ProducerService,
  ) { }

  @Get('/emit-message-to-product')
  async getHello() {
    log('I am here to emit meesage from order microservice');

    // return this.producerService.send();
    // return this.appService.getHello();
  }
}
