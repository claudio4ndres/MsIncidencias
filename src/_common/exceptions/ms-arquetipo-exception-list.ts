import { HttpStatus } from '@nestjs/common';
import { msArquetipoResponseCodes } from '../enums';

export type MsArquetipoExceptionCode = msArquetipoResponseCodes;

type ExceptionData = {
  errorCode: string;
  message: string;
  status: number;
};

type TarjetasExceptionList = {
  [key in MsArquetipoExceptionCode]: ExceptionData;
};

/**
 * Listados de excepciones declaradas.
 */
export const msArquetipoResponseList: TarjetasExceptionList = {
  [msArquetipoResponseCodes.TokenInvalido]: {
    status: HttpStatus.FORBIDDEN,
    errorCode: msArquetipoResponseCodes.TokenInvalido,
    message: '',
  },
  [msArquetipoResponseCodes.CaptchaInvalido]: {
    status: HttpStatus.FORBIDDEN,
    message: '',
    errorCode: msArquetipoResponseCodes.CaptchaInvalido,
  },
  [msArquetipoResponseCodes.Forbidden]: {
    status: HttpStatus.FORBIDDEN,
    message: '',
    errorCode: msArquetipoResponseCodes.Forbidden,
  },
  [msArquetipoResponseCodes.Unhandled]: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    message: '',
    errorCode: msArquetipoResponseCodes.Unhandled,
  },
};
