import { ExecutionContext } from '@nestjs/common';
import { msArquetipoResponseCodes } from '@src/_common/enums';
import { CustomException } from '@src/_common/exceptions';
import { TokenGuard } from '@src/_common/guards';

describe('TokenGuard', () => {
  let tokenGuard: TokenGuard;

  beforeEach(() => {
    const mockConfigService = {
      get: () => {
        return {
          SecretJson: {
            JWT_SECRET: 'mi-secreto',
          },
        };
      },
    };

    const mockJwtService = {
      verify: () => ({
        sub: 'mi-usuario',
      }),
    };

    tokenGuard = new TokenGuard(
      mockJwtService as any,
      mockConfigService as any,
    );
  });

  it('debería lanzar una excepción si no se proporciona un token de autorización', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          header: () => undefined,
        }),
      }),
    } as ExecutionContext;

    try {
      await tokenGuard.canActivate(mockContext);
    } catch (error) {
      expect(error).toBeInstanceOf(CustomException);
      // @ts-ignore
      expect(error.response.code).toBe(msArquetipoResponseCodes.TokenInvalido);
    }
  });

  it('debería lanzar una excepción si el token es inválido', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          header: () => 'Bearer token-invalido',
        }),
      }),
    } as ExecutionContext;

    try {
      await tokenGuard.canActivate(mockContext);
    } catch (error) {
      expect(error).toBeInstanceOf(CustomException);
      // @ts-ignore
      expect(error.response.errorCode).toBe(
        msArquetipoResponseCodes.TokenInvalido,
      );
      // @ts-ignore
      expect(error.response.message).toBe('Token Expirado o inválido');
    }
  });

  it('debería devolver true si el token es válido', async () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({
          header: () => 'Bearer token-valido',
        }),
      }),
    } as ExecutionContext;

    const result = await tokenGuard.canActivate(mockContext);

    expect(result).toBe(true);
  });
});
