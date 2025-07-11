"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelDecorator = void 0;
const common_1 = require("@nestjs/common");
const detect_device_helper_1 = require("../helpers/detect-device.helper");
exports.ChannelDecorator = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('headers ', request.headers);
    const channel = (0, detect_device_helper_1.detectDevice)(request.headers);
    return channel;
});
//# sourceMappingURL=channel.decorator.js.map