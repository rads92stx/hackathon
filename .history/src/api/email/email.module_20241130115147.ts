import { EmailController } from '@api/email/email.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [EmailController]
})
export class EmailModule {}
