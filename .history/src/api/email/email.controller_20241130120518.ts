import { IEmailSend } from '@api/email/interfaces/email-send.interface';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('api/email')
export class EmailApiController {

  @Get('drafts')
  getDrafts(): string {
    return null;
  }

  @Post('send')
  sendResponse(@Body() dto: IEmailSend): string {
    return null;
  }
}
