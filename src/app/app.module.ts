import { ApiModule } from '@api/api.module';
import { AppController } from '@app/app.controller';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigModule } from 'src/app-config/app-config.module';
import { OpenaiService } from 'src/services/openai.service';

@Module({
  imports: [ConfigModule.forRoot(), AppConfigModule.forRoot(), ApiModule],
  controllers: [AppController],
  providers: [OpenaiService]
})
export class AppModule {}
