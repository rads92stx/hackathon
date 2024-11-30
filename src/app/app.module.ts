import { ApiModule } from '@api/api.module';
import { AppController } from '@app/app.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { QDrantModule } from 'src/qdrant/qdrant.module';
import { OpenaiService } from 'src/services/openai.service';

@Module({
  imports: [ConfigModule.forRoot(), AppConfigModule.forRoot(), QDrantModule.forRoot(), ApiModule],
  providers: [OpenaiService],
  controllers: [AppController]
})
export class AppModule {}
