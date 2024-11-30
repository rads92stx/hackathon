import { ApiModule } from '@api/api.module';
import { AppController } from '@app/app.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [ApiModule],
  controllers: [AppController]
})
export class AppModule {}
