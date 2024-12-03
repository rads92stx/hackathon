import { Controller, Get } from '@nestjs/common';
import OpenAI from 'openai';
import { OpenaiService } from 'src/openai/services/openai.service';

@Controller()
export class AppController {
  constructor(private readonly __openAiService: OpenaiService) {}

  @Get()
  async getHello(): Promise<string> {
    const content = 'Tell a joke about a PHP programmer.';

    const answer = (await this.__openAiService.completion({
      messages: [{ role: 'user', content }],
      model: 'gpt-3.5-turbo',
      maxTokens: 4096
    })) as OpenAI.Chat.Completions.ChatCompletion;

    return answer.choices.at(0).message?.content || 'No jokes today';
  }
}
