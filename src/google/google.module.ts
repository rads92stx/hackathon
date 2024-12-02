import { GoogleAuthController } from '@google/google-auth.controller';
import { GoogleService } from '@google/services/google.service';
import { DynamicModule, Inject, Module, OnApplicationBootstrap } from '@nestjs/common';

@Module({})
export class GoogleModule implements OnApplicationBootstrap {
  @Inject(GoogleService)
  private __googleService: GoogleService;

  static forRoot(): DynamicModule {
    return {
      module: GoogleModule,
      global: true,
      providers: [GoogleService],
      exports: [GoogleService],
      controllers: [GoogleAuthController]
    };
  }

  onApplicationBootstrap(): void {
    this.__googleService.authenticate();
  }
}
