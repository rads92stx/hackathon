import { EmailApiModule } from '@api/email/email.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [EmailApiModule]
})
export class ApiModule {}
