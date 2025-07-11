"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.msArquetipoResponseList = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../enums");
exports.msArquetipoResponseList = {
    [enums_1.msArquetipoResponseCodes.TokenInvalido]: {
        status: common_1.HttpStatus.FORBIDDEN,
        errorCode: enums_1.msArquetipoResponseCodes.TokenInvalido,
        message: '',
    },
    [enums_1.msArquetipoResponseCodes.CaptchaInvalido]: {
        status: common_1.HttpStatus.FORBIDDEN,
        message: '',
        errorCode: enums_1.msArquetipoResponseCodes.CaptchaInvalido,
    },
    [enums_1.msArquetipoResponseCodes.Forbidden]: {
        status: common_1.HttpStatus.FORBIDDEN,
        message: '',
        errorCode: enums_1.msArquetipoResponseCodes.Forbidden,
    },
    [enums_1.msArquetipoResponseCodes.Unhandled]: {
        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
        message: '',
        errorCode: enums_1.msArquetipoResponseCodes.Unhandled,
    },
};
//# sourceMappingURL=ms-arquetipo-exception-list.js.map