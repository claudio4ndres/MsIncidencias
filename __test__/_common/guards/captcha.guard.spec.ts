import { HttpService } from '@nestjs/axios';
import { ExecutionContext } from '@nestjs/common';
import { CaptchaGuard } from '@common/guards/captcha.guard';
import { LoggerService } from '@common/logger/logger.service';
import { CustomException } from '@src/_common/exceptions';
import { SecretConfigService } from '@src/_common/config/secret-config/secret-config.service';
import { msArquetipoResponseCodes } from '@src/_common/enums';

const mockedHttpService = {
  axiosRef: {
    post: jest.fn(),
  },
};

const mockedConfigService = {
  get: jest.fn(),
};

const mockedLogService = {
  log: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
};

function createContextWithHeaders(
  headers: {
    [key: string]: string;
  } = {},
  request?: { [key: string]: unknown },
): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => {
        const header = (headerName: string) => {
          return headers[headerName];
        };
        if (!request) {
          return {
            header,
          };
        }
        request.header = header;
        return request;
      },
    }),
    getHandler: () => () => {
      //
    },
  } as unknown as ExecutionContext;
}

describe('Testing de CaptchaGuard', () => {
  let guard: CaptchaGuard;

  const missingTokenException = new CustomException(
    msArquetipoResponseCodes.CaptchaInvalido,
    undefined,
    `Token recaptcha es inválido o está expirado.`,
  );

  const gCaptchaErrorException = new CustomException(
    msArquetipoResponseCodes.CaptchaInvalido,
    undefined,
    `Token recaptcha es inválido o está expirado.`,
  );

  beforeEach(() => {
    guard = new CaptchaGuard(
      mockedHttpService as unknown as HttpService,
      mockedLogService as unknown as LoggerService,
      mockedConfigService as unknown as SecretConfigService,
    );
  });

  it('debe retornar falso si el header no esta definido', async () => {
    await expect(
      async () => await guard.canActivate(createContextWithHeaders()),
    ).rejects.toThrow(missingTokenException);
  });

  it('debe retornar falso si el header no esta formado correctamente', async () => {
    await expect(async () => {
      await guard.canActivate(
        createContextWithHeaders({ 'x-captcha': 'anything goes' }),
      );
    }).rejects.toThrow(gCaptchaErrorException);
  });
});
