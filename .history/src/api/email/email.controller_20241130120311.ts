import { Controller, Get } from '@nestjs/common';

@Controller()
export class EmailApiController {
  @Get()
  getHello(): string {
    return null;
  }
}
