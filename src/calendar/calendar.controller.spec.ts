import { Test, TestingModule } from '@nestjs/testing';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';

describe('CalendarController', () => {
  let controller: CalendarController;
  let service: CalendarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CalendarController],
      providers: [
        {
          provide: CalendarService,
          useValue: {
            findAll: jest.fn(),
            findByPeriod: jest.fn(),
            findByMonth: jest.fn(),
            findByDateRange: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            bulkCreate: jest.fn(),
            importFromExcel: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            validateRules: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CalendarController>(CalendarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
