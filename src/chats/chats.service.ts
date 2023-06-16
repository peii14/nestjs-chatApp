import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatsRepository } from './chats.repository';
import { EventPublisher } from '@nestjs/cqrs';
import { PubSubService } from '../pubsub.service';

@Injectable()
export class ChatsService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly pubSubService: PubSubService,
  ) {}

  async createChat(createChatDto: CreateChatDto) {
    return await this.chatsRepository.createChat(createChatDto);
  }

  async findAllChats(id: string) {
    return await this.chatsRepository.findAllChats(id);
  }
  async appendMLPredictionToChat(chatId: string) {
    // Subscribe to the prediction_result topic
    this.pubSubService.subscribe('prediction_result', async (message) => {
      // Extract prediction result from the message
      const predictionResult = message.data;

      // Fetch the chat to which the prediction should be appended
      const chat = await this.chatsRepository.findOne(chatId);

      if (!chat) {
        throw new Error(`Chat not found with ID ${chatId}`);
      }

      // Append the prediction result to the chat's message
      chat.message += ` Prediction: ${predictionResult}`;

      // Save the updated chat
      await this.chatsRepository.save(chat);
    });
  }
}
