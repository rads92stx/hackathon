import { Body, Controller, Get, HttpCode, Logger, Post, Query } from '@nestjs/common';
import OpenAI from 'openai';
import { OpenaiService } from 'src/openai/services/openai.service';
import { QDrantService } from 'src/qdrant/services/qdrant.service';

const COLLECTION_NAME = 'stxnext';
const MIN_SCORE = 0.5;

@Controller()
export class AppController {
  constructor(
    private readonly __openAiService: OpenaiService,
    private readonly __qdrantService: QDrantService
  ) {}

  private readonly logger: Logger = new Logger(AppController.name);

  @Get()
  async getHello(): Promise<string> {
    const test = (await this.__openAiService.completion({
      messages: [{ role: 'system', content: 'Twoim zadaniem jest opowiadanie żartów na temat programistów.' }]
    })) as OpenAI.Chat.Completions.ChatCompletion;

    return test.choices[0].message.content;
  }

  @Post('init')
  async test(@Body() body: { text: string; header: string }[]) {
    const points = body.map(({header, text}) => ({
      text,
      metadata: { header }
    }));

    return await this.__qdrantService.initializeCollectionWithData(COLLECTION_NAME, points);
  }

  @Post('insert-data')
  async test2(@Body() body: { text: string; header: string }[]) {
    const points = body.map(({header, text}) => ({
      text,
      metadata: { header }
    }));

    return await this.__qdrantService.insertData(COLLECTION_NAME, points);
  }

  @HttpCode(200)
  @Post('handle-email')
  async extract(@Body('mail') mail: string) {
    const extractedQuestions = await this.__openAiService.extractQuestions(mail);

    const preparedData = await Promise.all(
      extractedQuestions.map(async (question) => ({
        example: question,
        data: (await this.__qdrantService.performSearch(COLLECTION_NAME, question, {}, 1)).at(0).payload?.text
      }))
    );

    const mapped = await Promise.all(
      preparedData.map(async ({ data, example }) => ({
        question: example,
        response: await this.__openAiService.askQuestion(JSON.stringify({ data, example }))
      }))
    );

    const personalInformation = await this.__openAiService.getPersonalInfo(mail);

    return await this.__openAiService.composeEmail(JSON.stringify({personalInformation, data:mapped}));
  }

  @Post('search')
  async performSearch(@Body('question') question) {
    const answer = await this.__qdrantService.performSearch(COLLECTION_NAME, question, {}, 1);

    if (answer.at(0).score < MIN_SCORE) return 'I have no idea :)';

    return !answer ? 'No answer :(' : answer;
  }
}
