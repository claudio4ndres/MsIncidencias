import { HttpException } from '@nestjs/common/exceptions';
import { MsArquetipoExceptionCode } from '.';
import { msArquetipoResponseList } from './ms-arquetipo-exception-list';

const completeExceptionList: any = {
  ...msArquetipoResponseList,
};

/**
 * Class para el manejo de error.
 */
export class CustomException extends HttpException {
  exceptionCode: MsArquetipoExceptionCode;
  rawError: string | undefined;
  dataError?: any;

  constructor(
    exceptionCode: MsArquetipoExceptionCode,
    rawError?: string | undefined,
    message?: string,
    dataError?: any | undefined,
  ) {
    const errorData = completeExceptionList[exceptionCode];

    super(
      {
        code: errorData?.errorCode,
        statusCode: errorData?.status,
        message: message || errorData?.message,
        rawError: rawError,
        dataError: dataError || null,
      },
      errorData?.status,
    );

    this.exceptionCode = exceptionCode;
    this.rawError = rawError;
    this.dataError = dataError;
  }
}
