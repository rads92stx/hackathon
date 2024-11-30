import { AppController } from '@app/app.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [AppController]
})
export class AppModule {}
