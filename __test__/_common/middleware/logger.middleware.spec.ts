import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '@common/logger/logger.service';
import { LoggerMiddleware } from '@common/middleware/logger.middleware';

const mockAppLoggerService = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  log: jest.fn(),
};

const mockRequest = {
  ip: 'localhost',
  method: 'GET',
  originalUrl: 'testURL',
  get: jest.fn().mockReturnValue('test'),
  body: {},
} as unknown as Request;
const mockResponse = {
  json: jest.fn(),
} as unknown as Response;
const mockNext = jest.fn() as unknown as NextFunction;

describe('Testing de Middleware', () => {
  let service: LoggerMiddleware;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerMiddleware,
        {
          provide: LoggerService,
          useValue: mockAppLoggerService,
        },
      ],
    }).compile();
    service = module.get<LoggerMiddleware>(LoggerMiddleware);
  });

  it('debe de estar definido', () => {
    expect(service).toBeDefined();
  });

  it('debe de llamar a metodo "log"', () => {
    service.use(mockRequest, mockResponse, mockNext);
    expect(mockAppLoggerService.log).toHaveBeenCalled();
  });
});
