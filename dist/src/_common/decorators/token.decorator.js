"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenDecorator = void 0;
const common_1 = require("@nestjs/common");
exports.TokenDecorator = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.token;
});
//# sourceMappingURL=token.decorator.js.map