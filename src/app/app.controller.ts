import { Controller, Get } from '@nestjs/common';
import OpenAI from 'openai';
import { OpenaiService } from 'src/openai/services/openai.service';

const COLLECTION_NAME = 'stxnext';
const MIN_SCORE = 0.5;

@Controller()
export class AppController {
  constructor(private readonly __openAiService: OpenaiService) {}

  @Get()
  async getHello(): Promise<string> {
    const test = (await this.__openAiService.completion({
      messages: [{ role: 'system', content: 'Twoim zadaniem jest opowiadanie żartów na temat programistów.' }]
    })) as OpenAI.Chat.Completions.ChatCompletion;

    return test.choices[0].message.content;
  }
}
