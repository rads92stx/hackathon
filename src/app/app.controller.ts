import { Controller, Get } from '@nestjs/common';
import OpenAI from 'openai';
import { OpenaiService } from 'src/services/openai.service';

@Controller()
export class AppController {
  constructor(private openAiService: OpenaiService) {}

  @Get()
  async getHello(): Promise<string> {
    const test = await this.openAiService.completion({
      messages: [
        { role: 'system', content: 'Twoim zadaniem jest opowiadanie żartów na temat programistów.' }
      ]
    }) as OpenAI.Chat.Completions.ChatCompletion;

    return test.choices[0].message.content;
  }
}
