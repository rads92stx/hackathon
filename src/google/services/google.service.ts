import { AppConfigService } from '@config/services/app-config.service';
import { IGmailMessage } from '@google/interfaces/gmail-message.interface';
import { IGoogleToken } from '@google/interfaces/google-tokens.interface';
import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { OAuth2Client } from 'google-auth-library';
import { gmail_v1, google } from 'googleapis';
import * as path from 'path';
import { BehaviorSubject, filter } from 'rxjs';

@Injectable()
export class GoogleService {
  private __TOKEN_PATH = path.join(process.env.HACKHATON_APP_ROOT, 'gcloud-tokens.json');
  private __client = new google.auth.OAuth2(
    this.__appConfigService.get('GCLOUD_CLIENT_ID'),
    this.__appConfigService.get('GCLOUD_CLIENT_SECRET'),
    this.__appConfigService.get('GCLOUD_REDIRECT_URL')
  );
  private __state: string;
  private __logger = new Logger(GoogleService.name);
  private __token$ = new BehaviorSubject<IGoogleToken>(null);
  readonly token$ = this.__token$.pipe(filter((token) => !!token));

  constructor(private __appConfigService: AppConfigService) {
    this.__client.on('tokens', (token) => {
      const value = {
        access_token: token.access_token,
        scope: token.scope,
        token_type: token.token_type,
        expiry_date: token.expiry_date,
        ...(token.refresh_token && { refresh_token: token.refresh_token })
      };

      token.refresh_token && this.__client.setCredentials(value);

      this.__logger.log('Tokens set:', value);

      this.__logger.warn(JSON.stringify(value));
      fs.writeFile(this.__TOKEN_PATH, JSON.stringify(value), (err) => {
        if (err) {
          this.__logger.error('Error saving tokens to file', err);
        } else {
          this.__logger.warn('Tokens saved to', this.__TOKEN_PATH);
          this.__token$.next(value);
        }
      });
    });

    if (fs.existsSync(this.__TOKEN_PATH)) {
      const token = JSON.parse(fs.readFileSync(this.__TOKEN_PATH).toString());
      this.__client.setCredentials(token);
      this.__token$.next(token);
    }
  }

  get state(): string {
    return this.__state;
  }

  get client(): OAuth2Client {
    return this.__client;
  }

  get isAuthenticated(): boolean {
    return !!this.__token$.value;
  }

  get gmail(): gmail_v1.Gmail {
    return google.gmail({
      version: 'v1',
      auth: this.__client
    });
  }

  authenticate(): void {
    this.__logger.warn('Authenticating with Google...');

    if (this.isAuthenticated) {
      this.__logger.warn('Already authenticated!');
      return;
    }

    const configScopes = this.__appConfigService.get('GCLOUD_SCOPES');
    const scope = (configScopes || '').split(',');

    this.__state = crypto.randomBytes(32).toString('hex');

    const authorizationUrl = this.__client.generateAuthUrl({
      access_type: 'offline',
      scope,
      include_granted_scopes: true,
      state: this.__state
    });

    this.__logger.warn('Authorization URL:', authorizationUrl);
  }

  setCredentials(code: string): void {
    this.__logger.warn('Setting credentials...');

    this.__client.getToken(code, (err, token: IGoogleToken) => {
      if (err) {
        this.__logger.error('Error while trying to retrieve access token', err);
        return;
      }

      this.__client.setCredentials(token);
    });
  }

  async getUnreadEmails(): Promise<IGmailMessage[]> {
    if (!this.isAuthenticated) {
      return [];
    }

    const messages = (
      await this.gmail.users.messages.list({
        userId: 'me',
        q: 'is:unread'
      })
    )?.data?.messages;

    const res: IGmailMessage[] = [];

    for (const message of messages || []) {
      const mail = (
        await this.gmail.users.messages.get({
          id: message.id,
          userId: 'me'
        })
      )?.data;

      /**
       * TODO: Need to handle various types of parts by checking the MIME type in part.mimeType(?)
       * i.e. from what I saw html email has usually two parts. Index 0 is plain text version and index 1 is html version.
       * So right know we have duplicates in the aggregated array.
       */
      res.push(
        ...mail?.payload?.parts?.map((part) => ({
          messageId: mail.id,
          threadId: mail.threadId,
          body: Buffer.from(part.body.data, 'base64').toString()
        }))
      );
    }

    return res;
  }
}
