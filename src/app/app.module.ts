import { ApiModule } from '@api/api.module';
import { AppController } from '@app/app.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { OpenaiModule } from 'src/openai/openai.module';
import { QDrantModule } from 'src/qdrant/qdrant.module';

@Module({
  imports: [ConfigModule.forRoot(), AppConfigModule.forRoot(), QDrantModule.forRoot(), OpenaiModule.forRoot(), ApiModule],
  controllers: [AppController]
})
export class AppModule {}
