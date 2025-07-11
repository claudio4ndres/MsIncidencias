import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { Test, TestingModule } from '@nestjs/testing';
import { ChannelDecorator } from '@src/_common/decorators/channel.decorator';
import * as httpMock from 'node-mocks-http';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import * as detectDeviceHelper from '@src/_common/helpers/detect-device.helper';
import { ChannelEnum } from '@enums';

jest.mock('@src/_common/helpers/detect-device.helper');

describe('Testing de Channel Decorator', () => {
  function getParamDecoratorFactory() {
    class TestDecorator {
      public test(@ChannelDecorator() value) {
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

  describe('Prueba de decorador "channel"', () => {
    it('debería funcionar correctamente', () => {
      const req = httpMock.createRequest();
      const res = httpMock.createResponse();
      req.headers = {
        'user-agent': 'Mozilla/5.0',
        'cloudfront-is-android-viewer': 'true',
        'cloudfront-is-desktop-viewer': 'false',
        'cloudfront-is-ios-viewer': 'false',
        'cloudfront-is-mobile-viewer': 'true',
      };

      const mockChannel = ChannelEnum.Web;
      jest
        .spyOn(detectDeviceHelper, 'detectDevice')
        .mockReturnValue(mockChannel);

      const factory = getParamDecoratorFactory();
      const context = new ExecutionContextHost([req, res]);
      const result = factory(null, context, null);

      expect(result).toBe(mockChannel);
      expect(detectDeviceHelper.detectDevice).toHaveBeenCalledWith(req.headers);
    });
  });

  it('debería devolver ChannelEnum.Web cuando detectDevice devuelve ChannelEnum.Web', () => {
    const req = httpMock.createRequest();
    const res = httpMock.createResponse();
    req.headers = {
      'user-agent': 'Mozilla/5.0',
      'cloudfront-is-android-viewer': 'false',
      'cloudfront-is-desktop-viewer': 'true',
      'cloudfront-is-ios-viewer': 'false',
      'cloudfront-is-mobile-viewer': 'false',
    };

    const mockChannel = ChannelEnum.Web;
    jest.spyOn(detectDeviceHelper, 'detectDevice').mockReturnValue(mockChannel);

    const factory = getParamDecoratorFactory();
    const context = new ExecutionContextHost([req, res]);
    const result = factory(null, context, null);

    expect(result).toBe(mockChannel);
    expect(detectDeviceHelper.detectDevice).toHaveBeenCalledWith(req.headers);
  });

  it('debería devolver ChannelEnum.Mobile cuando detectDevice devuelve ChannelEnum.Mobile', () => {
    const req = httpMock.createRequest();
    const res = httpMock.createResponse();
    req.headers = {
      'user-agent': 'Mozilla/5.0',
      'cloudfront-is-android-viewer': 'true',
      'cloudfront-is-desktop-viewer': 'false',
      'cloudfront-is-ios-viewer': 'false',
      'cloudfront-is-mobile-viewer': 'true',
    };

    const mockChannel = ChannelEnum.Mobile;
    jest.spyOn(detectDeviceHelper, 'detectDevice').mockReturnValue(mockChannel);

    const factory = getParamDecoratorFactory();
    const context = new ExecutionContextHost([req, res]);
    const result = factory(null, context, null);

    expect(result).toBe(mockChannel);
    expect(detectDeviceHelper.detectDevice).toHaveBeenCalledWith(req.headers);
  });

  it('debería devolver ChannelEnum.Desktop cuando detectDevice devuelve ChannelEnum.Desktop', () => {
    const req = httpMock.createRequest();
    const res = httpMock.createResponse();
    req.headers = {
      'user-agent': 'Mozilla/5.0',
      'cloudfront-is-android-viewer': 'false',
      'cloudfront-is-desktop-viewer': 'true',
      'cloudfront-is-ios-viewer': 'false',
      'cloudfront-is-mobile-viewer': 'false',
    };

    const mockChannel = ChannelEnum.Web;
    jest.spyOn(detectDeviceHelper, 'detectDevice').mockReturnValue(mockChannel);

    const factory = getParamDecoratorFactory();
    const context = new ExecutionContextHost([req, res]);
    const result = factory(null, context, null);

    expect(result).toBe(mockChannel);
    expect(detectDeviceHelper.detectDevice).toHaveBeenCalledWith(req.headers);
  });

  it('debería devolver ChannelEnum.IOS cuando detectDevice devuelve ChannelEnum.IOS', () => {
    const req = httpMock.createRequest();
    const res = httpMock.createResponse();
    req.headers = {
      'user-agent': 'Mozilla/5.0',
      'cloudfront-is-android-viewer': 'false',
      'cloudfront-is-desktop-viewer': 'false',
      'cloudfront-is-ios-viewer': 'true',
      'cloudfront-is-mobile-viewer': 'true',
    };

    const mockChannel = ChannelEnum.App;
    jest.spyOn(detectDeviceHelper, 'detectDevice').mockReturnValue(mockChannel);

    const factory = getParamDecoratorFactory();
    const context = new ExecutionContextHost([req, res]);
    const result = factory(null, context, null);

    expect(result).toBe(mockChannel);
    expect(detectDeviceHelper.detectDevice).toHaveBeenCalledWith(req.headers);
  });

  it('debería devolver ChannelEnum.Android cuando detectDevice devuelve ChannelEnum.Android', () => {
    const req = httpMock.createRequest();
    const res = httpMock.createResponse();
    req.headers = {
      'user-agent': 'Mozilla/5.0',
      'cloudfront-is-android-viewer': 'true',
      'cloudfront-is-desktop-viewer': 'false',
      'cloudfront-is-ios-viewer': 'false',
      'cloudfront-is-mobile-viewer': 'true',
    };

    const mockChannel = ChannelEnum.App;
    jest.spyOn(detectDeviceHelper, 'detectDevice').mockReturnValue(mockChannel);

    const factory = getParamDecoratorFactory();
    const context = new ExecutionContextHost([req, res]);
    const result = factory(null, context, null);

    expect(result).toBe(mockChannel);
    expect(detectDeviceHelper.detectDevice).toHaveBeenCalledWith(req.headers);
  });
});
