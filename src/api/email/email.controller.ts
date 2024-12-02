import { IEmailSend } from '@api/email/interfaces/email-send.interface';
import { OpenaiService } from '@apneai/services/openai.service';
import { AppConfigService } from '@config/services/app-config.service';
import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { QDrantService } from '@qdrant/services/qdrant.service';

@Controller('api/email')
export class EmailApiController {
  private readonly __COLLECTION_NAME = this.__appService.get('COLLECTION_NAME');
  private readonly __MIN_SCORE = +this.__appService.get('MIN_SCORE');

  constructor(
    private readonly __appService: AppConfigService,
    private readonly __openAiService: OpenaiService,
    private readonly __qdrantService: QDrantService
  ) {}

  @Get('drafts')
  async getDrafts(): Promise<string> {
    const result = await this.__qdrantService.client.getCollections();

    return this.__appService.get('QDRANT_API_KEY');
  }

  @Post('send')
  sendResponse(@Body() dto: IEmailSend): void {}

  @Post('init')
  async test(@Body() body: { text: string; header: string }[]) {
    const points = body.map(({ header, text }) => ({
      text,
      metadata: { header }
    }));

    return await this.__qdrantService.initializeCollectionWithData(this.__COLLECTION_NAME, points);
  }

  @Post('insert-data')
  async test2(@Body() body: { text: string; header: string }[]) {
    const points = body.map(({ header, text }) => ({
      text,
      metadata: { header }
    }));

    return await this.__qdrantService.insertData(this.__COLLECTION_NAME, points);
  }

  @HttpCode(200)
  @Post('handle-email')
  async extract(@Body('mail') mail: string) {
    const extractedQuestions = await this.__openAiService.extractQuestions(mail);

    const preparedData = await Promise.all(
      extractedQuestions.map(async (question) => ({
        example: question,
        data: (await this.__qdrantService.performSearch(this.__COLLECTION_NAME, question, {}, 1)).at(0).payload?.text
      }))
    );

    const mapped = await Promise.all(
      preparedData.map(async ({ data, example }) => ({
        question: example,
        response: await this.__openAiService.askQuestion(JSON.stringify({ data, example }))
      }))
    );

    const personalInformation = await this.__openAiService.getPersonalInfo(mail);

    return await this.__openAiService.composeEmail(JSON.stringify({ personalInformation, data: mapped }));
  }

  @Post('search')
  async performSearch(@Body('question') question) {
    const answer = await this.__qdrantService.performSearch(this.__COLLECTION_NAME, question, {}, 1);

    if (answer.at(0).score < this.__MIN_SCORE) return 'I have no idea :)';

    return !answer ? 'No answer :(' : answer;
  }
}
