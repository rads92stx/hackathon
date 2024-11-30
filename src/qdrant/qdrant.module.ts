import { DynamicModule, Module } from '@nestjs/common';
import { QDrantService } from './services/qdrant.service';

@Module({})
export class QDrantModule {
  static forRoot(): DynamicModule {
    return {
      module: QDrantModule,
      global: true,
      providers: [QDrantService],
      exports: [QDrantService]
    };
  }
}
