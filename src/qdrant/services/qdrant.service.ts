import { AppConfigService } from '@config/services/app-config.service';
import { Injectable } from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';

@Injectable()
export class QDrantService {
  private __client = new QdrantClient({
    url: this.__appConfigService.get('QDRANT_URL'),
    apiKey: this.__appConfigService.get('QDRANT_API_KEY')
  });

  constructor(private __appConfigService: AppConfigService) {}

  get client(): QdrantClient {
    return this.__client;
  }
}
