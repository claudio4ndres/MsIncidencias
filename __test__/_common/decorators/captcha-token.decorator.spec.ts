import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { Test, TestingModule } from '@nestjs/testing';
import { CaptchaToken } from '@src/_common/decorators/captcha-token.decorator';
import * as httpMock from 'node-mocks-http';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

describe('Testing de CaptchaToken Decorator', () => {
  function getParamDecoratorFactory() {
    class TestDecorator {
      public test(@CaptchaToken() value) {
        return true;
      }
    }

    const args = Reflect.getMetadata(
      ROUTE_ARGS_METADATA,
      TestDecorator,
      'test',
    );
    return args[Object.keys(args)[0]].factory;
  }

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [],
    }).compile();
  });

  describe('Prueba de decorador "captcha-token"', () => {
    it('debe de funcionar correctamente', () => {
      const req = httpMock.createRequest();
      const res = httpMock.createResponse();
      req.headers['x-captcha'] = 'captchaTokenValue';

      const factory = getParamDecoratorFactory();
      const context = new ExecutionContextHost([req, res]);
      const result = factory(null, context, null);

      expect(result).toBe('captchaTokenValue');
    });
  });
});
