import { HttpException } from '@nestjs/common/exceptions';
import { MsArquetipoExceptionCode } from '.';
export declare class CustomException extends HttpException {
    exceptionCode: MsArquetipoExceptionCode;
    rawError: string | undefined;
    dataError?: any;
    constructor(exceptionCode: MsArquetipoExceptionCode, rawError?: string | undefined, message?: string, dataError?: any | undefined);
}
