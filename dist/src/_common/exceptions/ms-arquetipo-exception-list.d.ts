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
export declare const msArquetipoResponseList: TarjetasExceptionList;
export {};
