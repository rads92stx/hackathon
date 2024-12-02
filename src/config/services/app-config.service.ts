import { IAppConfig } from '@config/types/app-config.type';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  @Inject(ConfigService)
  private __configService: ConfigService;

  get(key: keyof IAppConfig): string {
    return this.__configService.get(key);
  }
}
