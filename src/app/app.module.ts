import { ApiModule } from '@api/api.module';
import { OpenaiModule } from '@apneai/openai.module';
import { AppController } from '@app/app.controller';
import { AppConfigModule } from '@config/app-config.module';
import { GoogleModule } from '@google/google.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { QDrantModule } from '@qdrant/qdrant.module';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AppConfigModule.forRoot(),
    QDrantModule.forRoot(),
    OpenaiModule.forRoot(),
    ApiModule,
    GoogleModule.forRoot(),
    ScheduleModule.forRoot(),
    EmailModule.forRoot()
  ],
  controllers: [AppController]
})
export class AppModule {}
