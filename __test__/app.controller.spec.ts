import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '@src/app.controller';
import { AppService } from '@src/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('health', () => {
    it('debería retornar "OK!"', () => {
      expect(appController.health()).toBe('OK!');
    });
  });
});
