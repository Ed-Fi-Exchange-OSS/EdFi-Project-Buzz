import { Controller, Get } from '@nestjs/common';
import AppService from './app.service';

@Controller()
class AppController {
  private readonly appService: AppService;

  constructor(appService: AppService) {
    this.appService = appService;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
export default AppController;
