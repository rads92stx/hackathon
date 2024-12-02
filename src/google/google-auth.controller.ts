import { GoogleService } from '@google/services/google.service';
import { Controller, Get, Inject, Query } from '@nestjs/common';

@Controller('google')
export class GoogleAuthController {
  @Inject(GoogleService)
  private __googleService: GoogleService;

  @Get('auth')
  auth(@Query() q: { error: unknown; code: string; state: string }): string {
    if (q.error) {
      console.error('Error:' + q.error);
      return 'Error:' + q.error;
    } else if (q.state !== this.__googleService.state) {
      console.warn('State mismatch. Possible CSRF attack');
      return 'State mismatch. Possible CSRF attack';
    }

    this.__googleService.setCredentials(q.code);

    return 'Google authentication successful. Tokens saved.';
  }
}
