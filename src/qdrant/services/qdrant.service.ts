import { AppConfigService } from '@config/services/app-config.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';
import { OpenaiService } from 'src/openai/services/openai.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class QDrantService {
  private __client = new QdrantClient({
    url: this.__appConfigService.get('QDRANT_URL'),
    apiKey: this.__appConfigService.get('QDRANT_API_KEY')
  });

  constructor(
    private readonly __appConfigService: AppConfigService,
    private readonly __openaiService: OpenaiService
  ) {}

  get client(): QdrantClient {
    return this.__client;
  }

  async ensureCollection(name: string) {
    const collections = await this.client.getCollections();
    if (!collections.collections.some((c) => c.name === name)) {
      await this.client.createCollection(name, {
        vectors: { size: 1024, distance: 'Cosine' }
      });
    }
  }

  async initializeCollectionWithData(
    name: string,
    points: Array<{
      id?: string;
      text: string;
      metadata?: Record<string, any>;
    }>
  ) {
    const collections = await this.client.getCollections();
    if (!collections.collections.some((c) => c.name === name)) {
      await this.ensureCollection(name);
      await this.addPoints(name, points);
    }
  }

  async addPoints(
    collectionName: string,
    points: Array<{
      id?: string;
      text: string;
      metadata?: Record<string, any>;
    }>
  ) {
    const pointsToUpsert = await Promise.all(
      points.map(async (point) => {
        const embedding = await this.__openaiService.createEmbedding(point.text);

        return {
          id: point.id || uuidv4(),
          vector: embedding,
          payload: {
            text: point.text,
            ...point.metadata
          }
        };
      })
    );

    await this.client.upsert(collectionName, {
      wait: true,
      points: pointsToUpsert
    });
  }

  async insertData(
    name: string,
    points: Array<{
      id?: string;
      text: string;
      metadata?: Record<string, any>;
    }>
  ) {
    const collections = await this.client.getCollections();
    if (!collections.collections.some((c) => c.name === name))
      return new BadRequestException("No collection found");

    return await this.addPoints(name, points);
  }

  async performSearch(collectionName: string, query: string, filter: Record<string, any> = {}, limit: number = 5) {
    const queryEmbedding = await this.__openaiService.createEmbedding(query);
    return this.client.search(collectionName, {
      vector: queryEmbedding,
      limit,
      with_payload: true,
      filter
    });
  }
}
