import { IAppConfig } from '@config/types/app-config.type';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private __configService: ConfigService) {}

  get(key: keyof IAppConfig): string {
    return this.__configService.get(key);
  }
}
