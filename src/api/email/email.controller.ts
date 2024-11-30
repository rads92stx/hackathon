import { IEmailSend } from '@api/email/interfaces/email-send.interface';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppConfigService } from 'src/app-config/services/app-config.service';

@Controller('api/email')
export class EmailApiController {
  constructor(private readonly __appService: AppConfigService) {}
  @Get('drafts')
  getDrafts(): string {
    return this.__appService.get('QDRANT_API_KEY');
  }

  @Post('send')
  sendResponse(@Body() dto: IEmailSend): void {}
}
