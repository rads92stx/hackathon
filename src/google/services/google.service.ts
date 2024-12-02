import { AppConfigService } from '@config/services/app-config.service';
import { IGmailMessage } from '@google/interfaces/gmail-message.interface';
import { IGoogleToken } from '@google/interfaces/google-tokens.interface';
import { Injectable } from '@nestjs/common';
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

      console.log('Tokens set:', value);

      console.warn(JSON.stringify(value));
      fs.writeFile(this.__TOKEN_PATH, JSON.stringify(value), (err) => {
        if (err) {
          console.error('Error saving tokens to file', err);
        } else {
          console.warn('Tokens saved to', this.__TOKEN_PATH);
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
    console.warn('Authenticating with Google...');

    if (this.isAuthenticated) {
      console.warn('Already authenticated!');
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

    console.warn('Authorization URL:', authorizationUrl);
  }

  setCredentials(code: string): void {
    console.warn('Setting credentials...');

    this.__client.getToken(code, (err, token: IGoogleToken) => {
      if (err) {
        console.error('Error while trying to retrieve access token', err);
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
