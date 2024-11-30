import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from 'src/app-config/services/app-config.service';

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
