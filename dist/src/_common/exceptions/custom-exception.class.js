"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomException = void 0;
const exceptions_1 = require("@nestjs/common/exceptions");
const ms_arquetipo_exception_list_1 = require("./ms-arquetipo-exception-list");
const completeExceptionList = {
    ...ms_arquetipo_exception_list_1.msArquetipoResponseList,
};
class CustomException extends exceptions_1.HttpException {
    constructor(exceptionCode, rawError, message, dataError) {
        const errorData = completeExceptionList[exceptionCode];
        super({
            code: errorData?.errorCode,
            statusCode: errorData?.status,
            message: message || errorData?.message,
            rawError: rawError,
            dataError: dataError || null,
        }, errorData?.status);
        this.exceptionCode = exceptionCode;
        this.rawError = rawError;
        this.dataError = dataError;
    }
}
exports.CustomException = CustomException;
//# sourceMappingURL=custom-exception.class.js.map