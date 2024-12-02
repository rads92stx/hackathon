import { OpenaiService } from '@apneai/services/openai.service';
import { DynamicModule, Module } from '@nestjs/common';

@Module({})
export class OpenaiModule {
  static forRoot(): DynamicModule {
    return {
      module: OpenaiModule,
      global: true,
      providers: [OpenaiService],
      exports: [OpenaiService]
    };
  }
}
