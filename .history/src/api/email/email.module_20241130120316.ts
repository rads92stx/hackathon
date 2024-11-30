import { EmailApiController } from '@api/email/email.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [EmailApiController]
})
export class EmailModule {}
