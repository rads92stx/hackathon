import { AppConfigService } from '@config/services/app-config.service';
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({})
export class AppConfigModule {
  static forRoot(): DynamicModule {
    return {
      module: AppConfigModule,
      global: true,
      imports: [ConfigModule],
      providers: [AppConfigService],
      exports: [AppConfigService]
    };
  }
}
