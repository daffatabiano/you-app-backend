import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { ClientProxy } from '@nestjs/microservices';
import { ChatService } from '../chat.service';
import { Chat } from '../schema/chat.schema';
import { ChatGateway } from '../chat.gateway';

// Mocking dependencies
const mockChatGateway = {
  broadCastMessage: jest.fn(),
};

const mockClientProxy = {
  emit: jest.fn(),
};

const mockChatModel = {
  findOne: jest.fn(),
  save: jest.fn().mockResolvedValue({
    sender: 'user1',
    receiver: 'user2',
    content: 'Hello, how are you?',
  }),
  find: jest.fn(),
  create: jest.fn().mockResolvedValue({
    sender: 'user1',
    receiver: 'user2',
    content: 'Hello, how are you?',
  }),
};

describe('ChatService', () => {
  let chatService: ChatService;
  let chatModel: Model<Chat>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        {
          provide: getModelToken('Chat'),
          useValue: mockChatModel,
        },
        {
          provide: ChatGateway,
          useValue: mockChatGateway,
        },
        {
          provide: 'CHAT_SERVICE',
          useValue: mockClientProxy,
        },
      ],
    }).compile();

    chatService = module.get<ChatService>(ChatService);
    chatModel = module.get<Model<Chat>>(getModelToken('Chat'));
  });

  describe('sendMessage', () => {
    it('should save the message, emit it to RabbitMQ and broadcast to WebSocket', async () => {
      const sender = 'user1';
      const receiver = 'user2';
      const content = 'Hello, how are you?';

      // Mock saved message to be returned by create
      const savedMessage = {
        sender,
        receiver,
        content,
      };

      // Call sendMessage and capture the result
      const result = await chatService.sendMessage(sender, receiver, content);

      // Validate that the result matches the expected saved message
      expect(result).toEqual(savedMessage);

      // Validate that create() was called with the correct data
      expect(mockChatModel.create).toHaveBeenCalledWith({ sender, receiver, content });

      // Validate that the message was emitted to RabbitMQ
      expect(mockClientProxy.emit).toHaveBeenCalledWith('message_queue', savedMessage);

      // Validate that the message was broadcasted via WebSocket
      expect(mockChatGateway.broadCastMessage).toHaveBeenCalledWith(savedMessage);
    });
  });

  describe('viewMessage', () => {
    it('should return an array of messages', async () => {
      const sender = 'user1';
      const receiver = 'user2';
      const messages = [
        { sender: 'user1', receiver: 'user2', content: 'Hello' },
        { sender: 'user2', receiver: 'user1', content: 'Hi' },
      ];

      // Mocking find method of the model
      mockChatModel.find.mockResolvedValue(messages);

      // Call the viewMessage method
      const result = await chatService.viewMessage(sender, receiver);

      // Validate that the result matches the mocked messages
      expect(result).toEqual(messages);

      // Validate that find was called with the correct query
      expect(mockChatModel.find).toHaveBeenCalledWith({
        $or: [
          { sender: sender, receiver: receiver },
          { sender: receiver, receiver: sender },
        ],
      });
    });
  });
});
