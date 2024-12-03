import { Injectable, Logger } from '@nestjs/common';
import askLlmPrompt from '@prompts/ask-llm';
import composeEmailPrompt from '@prompts/compose-email';
import extractQuestionsPrompt from '@prompts/extract-questions';
import personalInfoPrompt from '@prompts/personal-info';
import { IExtractQuestionsResponse, PersonalDetailsPromptResult } from '@shared/types';
import OpenAI from 'openai';
import { ChatCompletionMessageParam, CreateEmbeddingResponse } from 'openai/resources';

enum ChatCompletionUserType {
  SYSTEM = 'system',
  USER = 'user'
}

type ChatCompletionUserTypes = (typeof ChatCompletionUserType)[keyof typeof ChatCompletionUserType];

@Injectable()
export class OpenaiService {
  private __openai = new OpenAI();
  private __logger = new Logger(OpenaiService.name);

  async completion(config: {
    messages: ChatCompletionMessageParam[];
    model?: OpenAI.Chat.ChatModel;
    stream?: boolean;
    jsonMode?: boolean;
    maxTokens?: number;
  }): Promise<OpenAI.Chat.Completions.ChatCompletion> {
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

      this.__logger.debug({ chatCompletion, messages });

      return chatCompletion as OpenAI.Chat.Completions.ChatCompletion;
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

  async extractQuestions(content: string): Promise<string[]> {
    const messages = this.__composechatCompletionMessageParam({ systemPrompt: extractQuestionsPrompt(), content });

    const response = JSON.parse(
      this.__getChatMessageContent(await this.completion({ messages, jsonMode: true }))
    ) as IExtractQuestionsResponse;

    return response.questions;
  }

  async askQuestion(content: string): Promise<string> {
    const messages = this.__composechatCompletionMessageParam({ systemPrompt: askLlmPrompt(), content });   

    return this.__getChatMessageContent(await this.completion({ messages }));
  }

  async composeEmail(content: string): Promise<string> {
    const messages = this.__composechatCompletionMessageParam({ systemPrompt: composeEmailPrompt(), content });

    return this.__getChatMessageContent(await this.completion({ messages }));
  }

  async getPersonalInfo(content: string): Promise<PersonalDetailsPromptResult> {
    const messages = this.__composechatCompletionMessageParam({ systemPrompt: personalInfoPrompt(), content });

    return JSON.parse(this.__getChatMessageContent(await this.completion({ messages, jsonMode: true })));
  }

  private __createCompletionMessage(
    content: string,
    role: ChatCompletionUserTypes = ChatCompletionUserType.SYSTEM
  ): ChatCompletionMessageParam {
    return { role, content };
  }

  private __composechatCompletionMessageParam({ systemPrompt, content }: { systemPrompt: string; content: string }): OpenAI.Chat.Completions.ChatCompletionMessageParam[] {
    const systemMessage = this.__createCompletionMessage(systemPrompt);
    const userMessage = this.__createCompletionMessage(content, ChatCompletionUserType.USER);
    return [systemMessage, userMessage];
  }

  private __getChatMessageContent(chatMessage: OpenAI.Chat.Completions.ChatCompletion): string {
    return chatMessage.choices.at(0)?.message.content || '';
  }
}
