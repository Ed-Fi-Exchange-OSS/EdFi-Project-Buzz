import { Injectable } from '@nestjs/common';

@Injectable()
class AppService {
  private readonly text: string = 'Hello World!';

  getHello(): string {
    return this.text;
  }
}

export default AppService;
