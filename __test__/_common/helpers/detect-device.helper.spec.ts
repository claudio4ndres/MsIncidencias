import { ChannelEnum } from "@src/_common/enums";
import { detectDevice } from "@src/_common/helpers";

describe("Testing de detectDevice Funcion", () => {
  it("debe detectar cuando es web", () => {
    const headers = {
      "cloudfront-is-desktop-viewer": "true",
      "cloudfront-is-android-viewer": "false",
      "cloudfront-is-ios-viewer": "false",
      "cloudfront-is-mobile-viewer": "false",
      "user-agent": "asdf",
    };
    expect(detectDevice(headers)).toBe(ChannelEnum.Web);
  });

  it("debe detectar cuando es web_mobile", () => {
    const headersAndroid = {
      "cloudfront-is-desktop-viewer": "false",
      "cloudfront-is-android-viewer": "true",
      "cloudfront-is-ios-viewer": "false",
      "cloudfront-is-mobile-viewer": "true",
      "user-agent": "asdf device",
    };
    const headersIOS = {
      "cloudfront-is-desktop-viewer": "false",
      "cloudfront-is-android-viewer": "false",
      "cloudfront-is-ios-viewer": "true",
      "cloudfront-is-mobile-viewer": "true",
      "user-agent": "asdf device",
    };

    expect(detectDevice(headersAndroid)).toBe(ChannelEnum.Mobile);
    expect(detectDevice(headersIOS)).toBe(ChannelEnum.Mobile);
  });

  it("debe detectar cuando es app", () => {
    const headersAndroid = {
      "cloudfront-is-desktop-viewer": "false",
      "cloudfront-is-android-viewer": "true",
      "cloudfront-is-ios-viewer": "false",
      "cloudfront-is-mobile-viewer": "true",
      "user-agent": "incidencias device",
    };
    const headersIOS = {
      "cloudfront-is-desktop-viewer": "false",
      "cloudfront-is-android-viewer": "false",
      "cloudfront-is-ios-viewer": "true",
      "cloudfront-is-mobile-viewer": "true",
      "user-agent": "incidencias device",
    };

    expect(detectDevice(headersAndroid)).toBe(ChannelEnum.App);
    expect(detectDevice(headersIOS)).toBe(ChannelEnum.App);
  });
});
