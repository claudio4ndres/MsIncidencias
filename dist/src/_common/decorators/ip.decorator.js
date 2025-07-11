"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpDecorator = void 0;
const common_1 = require("@nestjs/common");
exports.IpDecorator = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const ip = request?.headers['x-forwarded-for'];
    return ip;
});
//# sourceMappingURL=ip.decorator.js.map