import { OpenaiService } from '@apneai/services/openai.service';
import { Controller, Get } from '@nestjs/common';
import OpenAI from 'openai';

@Controller()
export class AppController {
  constructor(private __openAiService: OpenaiService) {}

  @Get()
  async getHello(): Promise<string> {
    const test = (await this.__openAiService.completion({
      messages: [{ role: 'system', content: 'Twoim zadaniem jest opowiadanie żartów na temat programistów.' }]
    })) as OpenAI.Chat.Completions.ChatCompletion;

    return test.choices[0].message.content;
  }
}
