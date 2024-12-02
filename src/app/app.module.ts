import { ApiModule } from '@api/api.module';
import { OpenaiModule } from '@apneai/openai.module';
import { AppController } from '@app/app.controller';
import { AppConfigModule } from '@config/app-config.module';
import { EmailModule } from '@email/email.module';
import { GoogleModule } from '@google/google.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { QDrantModule } from '@qdrant/qdrant.module';
import { AppLoggerService } from '@shared/services/app-logger.service';

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
  providers: [AppLoggerService],
  controllers: [AppController]
})
export class AppModule {}
