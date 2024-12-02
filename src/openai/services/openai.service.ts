import { Injectable, Logger } from '@nestjs/common';
import askLlm from '@prompts/ask-llm';
import composeEmail from '@prompts/compose-email';
import extractQuestionsPrompt from '@prompts/extract-questions';
import personalInfo from '@prompts/personal-info';
import { IExtractQuestionsResponse } from '@shared/types';
import OpenAI from 'openai';
import { ChatCompletionMessageParam, CreateEmbeddingResponse } from 'openai/resources';

@Injectable()
export class OpenaiService {
  private __openai = new OpenAI();
  private __logger = new Logger(OpenaiService.name);

  constructor() {
    this.__openai = new OpenAI();
  }

  async completion(config: {
    messages: ChatCompletionMessageParam[];
    model?: OpenAI.Chat.ChatModel;
    stream?: boolean;
    jsonMode?: boolean;
    maxTokens?: number;
  }): Promise<OpenAI.Chat.Completions.ChatCompletion | AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>> {
    const { messages, model = 'gpt-4o', stream = false, jsonMode = false, maxTokens = 8096 } = config;
    try {
      const chatCompletion = await this.__openai.chat.completions.create({
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
      this.__logger.error('Error in OpenAI completion:', error);
      throw error;
    }
  }

  async createEmbedding(text: string): Promise<number[]> {
    try {
      const response: CreateEmbeddingResponse = await this.__openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        dimensions: 1024
      });
      return response.data[0].embedding;
    } catch (error) {
      this.__logger.error('Error creating embedding:', error);
      throw error;
    }
  }

  async extractQuestions(mail: string): Promise<string[]> {
    const systemMessage: ChatCompletionMessageParam = {
      role: 'system',
      content: extractQuestionsPrompt
    };

    const userMessage: ChatCompletionMessageParam = {
      role: 'user',
      content: mail
    };

    const response = (
      (await this.completion({
        messages: [systemMessage, userMessage],
        model: 'gpt-4o',
        jsonMode: true
      })) as OpenAI.Chat.Completions.ChatCompletion
    ).choices.at(0).message;

    const content = JSON.parse(response.content) as IExtractQuestionsResponse;
    this.__logger.debug(content);

    return content.questions;
  }

  async askQuestion(content: string) {
    const systemMessage: ChatCompletionMessageParam = {
      role: 'system',
      content: askLlm
    };

    const userMessage: ChatCompletionMessageParam = {
      role: 'user',
      content
    };

    const response = (await this.completion({
      messages: [systemMessage, userMessage],
      model: 'gpt-4o'
    })) as OpenAI.Chat.Completions.ChatCompletion;

    this.__logger.debug(userMessage);

    return response.choices.at(0).message.content;
  }

  async composeEmail(content: string) {
    const systemMessage: ChatCompletionMessageParam = {
      role: 'system',
      content: composeEmail
    };

    const userMessage: ChatCompletionMessageParam = {
      role: 'user',
      content
    };

    const response = (await this.completion({
      messages: [systemMessage, userMessage],
      model: 'gpt-4o'
    })) as OpenAI.Chat.Completions.ChatCompletion;

    this.__logger.debug({ response, systemMessage, userMessage });

    return response.choices.at(0).message.content;
  }

  async getPersonalInfo(content: string) {
    const systemMessage: ChatCompletionMessageParam = {
      role: 'system',
      content: personalInfo
    };

    const userMessage: ChatCompletionMessageParam = {
      role: 'user',
      content
    };

    const response = (await this.completion({
      messages: [systemMessage, userMessage],
      model: 'gpt-4o'
    })) as OpenAI.Chat.Completions.ChatCompletion;

    return response.choices.at(0).message.content;
  }
}
