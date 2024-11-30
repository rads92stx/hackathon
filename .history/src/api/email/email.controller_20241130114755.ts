import { Controller, Get } from '@nestjs/common';

@Controller()
export class EmailController {
  @Get()
  getHello(): string {
    return null;
  }
}
