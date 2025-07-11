"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
function getPathAfterPort(urlString) {
    try {
        const url = new url_1.URL(urlString);
        return url.pathname + url.search + url.hash;
    }
    catch (error) {
        return '';
    }
}
exports.default = getPathAfterPort;
//# sourceMappingURL=url.js.map