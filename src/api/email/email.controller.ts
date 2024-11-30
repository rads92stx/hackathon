import { IEmailSend } from '@api/email/interfaces/email-send.interface';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppConfigService } from 'src/app-config/services/app-config.service';
import { QDrantService } from 'src/qdrant/services/qdrant.service';

@Controller('api/email')
export class EmailApiController {
  constructor(
    private readonly __appService: AppConfigService,
    private readonly __qdrantService: QDrantService
  ) {}

  @Get('drafts')
  async getDrafts(): Promise<string> {
    const result = await this.__qdrantService.client.getCollections();
    console.log('List of collections:', result.collections);
    return this.__appService.get('QDRANT_API_KEY');
  }

  @Post('send')
  sendResponse(@Body() dto: IEmailSend): void {}
}
