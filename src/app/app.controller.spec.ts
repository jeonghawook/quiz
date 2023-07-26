import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Create a mock AppService
const mockAppService = {
  getHello: jest.fn(() => 'Hello World!'), // Mock the getHello method
};

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService, // Use the mockAppService for testing
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getHello', () => {
    it('should return "Hello World!"', () => {
      const result = appController.getHello();
      expect(result).toBe('Hello World!');
      // Ensure that the mockAppService.getHello method was called
      expect(mockAppService.getHello).toHaveBeenCalledTimes(1);
    });
  });
});
