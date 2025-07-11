"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectDevice = void 0;
const enums_1 = require("../enums");
const detectDevice = (headers) => {
    try {
        const { 'cloudfront-is-android-viewer': isAndroid, 'cloudfront-is-desktop-viewer': isDesktop, 'cloudfront-is-ios-viewer': isIos, 'cloudfront-is-mobile-viewer': isMobile, 'user-agent': userAgent, } = headers;
        if (JSON.parse(isDesktop))
            return enums_1.ChannelEnum.Web;
        if (JSON.parse(isMobile) && (JSON.parse(isAndroid) || JSON.parse(isIos))) {
            if (userAgent?.includes('coopeuchdale') ||
                userAgent?.includes('Coopeuch')) {
                return enums_1.ChannelEnum.App;
            }
            return enums_1.ChannelEnum.Mobile;
        }
    }
    catch (e) {
        return enums_1.ChannelEnum.DevDevice;
    }
};
exports.detectDevice = detectDevice;
//# sourceMappingURL=detect-device.helper.js.map