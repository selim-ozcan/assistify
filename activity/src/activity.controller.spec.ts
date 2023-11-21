import { Test, TestingModule } from '@nestjs/testing';
import { ActivityController } from './ActivityController';
import { ActivityService } from './activity.service';

describe('AppController', () => {
  let appController: ActivityController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ActivityController],
      providers: [ActivityService],
    }).compile();

    appController = app.get<ActivityController>(ActivityController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
