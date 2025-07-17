import { ChannelEnum } from "../enums";

export const detectDevice = (headers): ChannelEnum => {
  try {
    const {
      "cloudfront-is-android-viewer": isAndroid,
      "cloudfront-is-desktop-viewer": isDesktop,
      "cloudfront-is-ios-viewer": isIos,
      "cloudfront-is-mobile-viewer": isMobile,
      "user-agent": userAgent,
    } = headers;

    if (JSON.parse(isDesktop)) return ChannelEnum.Web;

    if (JSON.parse(isMobile) && (JSON.parse(isAndroid) || JSON.parse(isIos))) {
      if (
        userAgent?.includes("incidencias") ||
        userAgent?.includes("Incidencias")
      ) {
        return ChannelEnum.App;
      }

      return ChannelEnum.Mobile;
    }
  } catch (e) {
    return ChannelEnum.DevDevice;
  }
};
