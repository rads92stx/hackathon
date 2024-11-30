import { DynamicModule, Module } from '@nestjs/common';
import { OpenaiService } from './services/openai.service';

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
