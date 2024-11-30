import { EmailController } from '@api/email/email.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [EmailController]
})
export class ApiModule {}
