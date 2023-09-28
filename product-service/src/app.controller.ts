import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
// import ProducerService from './kafka/producer.service';
import { log } from 'console';
// import ProducerService from './kafka/producer.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,

    // @Inject(ProducerService)
    // private readonly producerService: ProducerService,
  ) { }

  @Get('/testing')
  getHello(): any {

    log('I am here');

    // return this.producerService.send();
    // return this.appService.getHello();
  }
}
