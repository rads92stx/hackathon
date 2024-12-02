import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletionMessageParam, CreateEmbeddingResponse } from 'openai/resources';

@Injectable()
export class OpenaiService {
  private openai = new OpenAI();

  async completion(config: {
    messages: ChatCompletionMessageParam[];
    model?: string;
    stream?: boolean;
    jsonMode?: boolean;
    maxTokens?: number;
  }): Promise<OpenAI.Chat.Completions.ChatCompletion | AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>> {
    const { messages, model = 'gpt-4o', stream = false, jsonMode = false, maxTokens = 8096 } = config;
    try {
      const chatCompletion = await this.openai.chat.completions.create({
        messages,
        model,
        ...(model !== 'o1-mini' &&
          model !== 'o1-preview' && {
            stream,
            max_tokens: maxTokens,
            response_format: jsonMode ? { type: 'json_object' } : { type: 'text' }
          })
      });

      return stream
        ? (chatCompletion as AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>)
        : (chatCompletion as OpenAI.Chat.Completions.ChatCompletion);
    } catch (error) {
      console.error('Error in OpenAI completion:', error);
      throw error;
    }
  }

  async createEmbedding(text: string): Promise<number[]> {
    try {
      const response: CreateEmbeddingResponse = await this.openai.embeddings.create({
        model: 'text-embedding-3-large',
        input: text
      });
      return response.data[0].embedding;
    } catch (error) {
      console.error('Error creating embedding:', error);
      throw error;
    }
  }
}
