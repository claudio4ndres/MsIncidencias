import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { TokenDecorator } from '@common/decorators/token.decorator';
import * as httpMock from 'node-mocks-http';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { HttpModule } from '@nestjs/axios';

describe('Testing de Token Decorator', () => {
  function getParamDecoratorFactory(/* decorator: Function */) {
    class TestDecorator {
      public test(@TokenDecorator() value) {
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
      imports: [HttpModule],
      controllers: [],
      providers: [ConfigService, JwtService],
    }).compile();
  });

  describe('Prueba de decorador "token"', () => {
    it('debe de funcionar correctamente', () => {
      const req = httpMock.createRequest();
      const res = httpMock.createResponse();
      req.token = 'tokenValueGoesHere';

      const factory = getParamDecoratorFactory();
      const context = new ExecutionContextHost([req, res]);
      const result = factory(null, context, null);

      expect(result).toBe(req.token);
    });
  });
});
