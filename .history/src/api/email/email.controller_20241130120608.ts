import { IEmailDraft } from '@api/email/interfaces/email-draft.interface';
import { IEmailSend } from '@api/email/interfaces/email-send.interface';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('api/email')
export class EmailApiController {
  @Get('drafts')
  getDrafts(): IEmailDraft[] {
    return [];
  }

  @Post('send')
  sendResponse(@Body() dto: IEmailSend): void {}
}
