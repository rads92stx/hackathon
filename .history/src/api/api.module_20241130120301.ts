import { Module } from '@nestjs/common';

@Module({
  imports: [EmailApiController]
})
export class ApiModule {}
