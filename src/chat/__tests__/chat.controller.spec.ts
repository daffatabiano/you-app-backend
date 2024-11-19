import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { ChatController } from '../chat.controller';
import { ChatService } from '../chat.service';

// Mocking ChatService
const mockChatService = {
  sendMessage: jest.fn().mockResolvedValue({ message: 'Message sent' }),
  viewMessage: jest.fn().mockResolvedValue([{ sender: 'user1', receiver: 'user2', content: 'Hello' }]),
};

// Mock AuthGuard
const mockAuthGuard = {
  canActivate: jest.fn().mockImplementation((context: ExecutionContext) => {
    return true; // Always allow in tests
  }),
};

describe('ChatController', () => {
  let chatController: ChatController;
  let chatService: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatController],
      providers: [
        {
          provide: ChatService,
          useValue: mockChatService,
        },
        {
          provide: AuthGuard('jwt'),
          useValue: mockAuthGuard,
        },
      ],
    }).compile();

    chatController = module.get<ChatController>(ChatController);
    chatService = module.get<ChatService>(ChatService);
  });

  describe('sendMessage', () => {
    it('should call sendMessage method and return a success message', async () => {
      const result = await chatController.sendMessage({
        sender: 'user1',
        receiver: 'user2',
        content: 'Hello, world!',
      });
      expect(result).toEqual({ message: 'Message sent' });
      expect(mockChatService.sendMessage).toHaveBeenCalledWith('user1', 'user2', 'Hello, world!');
    });
  });

  describe('viewMessage', () => {
    it('should call viewMessage method and return an array of messages', async () => {
      const result = await chatController.viewMessage({
        sender: 'user1',
        receiver: 'user2',
      });
      expect(result).toEqual([{ sender: 'user1', receiver: 'user2', content: 'Hello' }]);
      expect(mockChatService.viewMessage).toHaveBeenCalledWith('user1', 'user2');
    });
  });
});
