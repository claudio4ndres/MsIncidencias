"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CaptchaToken = void 0;
const common_1 = require("@nestjs/common");
exports.CaptchaToken = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.header('x-captcha');
});
//# sourceMappingURL=captcha-token.decorator.js.map