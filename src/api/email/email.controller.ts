import { IEmailSend } from '@api/email/interfaces/email-send.interface';
import { AppConfigService } from '@config/services/app-config.service';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { QDrantService } from '@qdrant/services/qdrant.service';

@Controller('api/email')
export class EmailApiController {
  @Inject(AppConfigService)
  private __appService: AppConfigService;
  @Inject(QDrantService)
  private __qdrantService: QDrantService;

  @Get('drafts')
  async getDrafts(): Promise<string> {
    const result = await this.__qdrantService.client.getCollections();

    return this.__appService.get('QDRANT_API_KEY');
  }

  @Post('send')
  sendResponse(@Body() dto: IEmailSend): void {}
}
