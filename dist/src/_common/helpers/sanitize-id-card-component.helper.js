"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeIdCardComponent = void 0;
function sanitizeIdCardComponent(string, split) {
    const sanitizedString = string.replace(/[\W_]/g, '').toUpperCase();
    return (split === 'split'
        ? [
            sanitizedString.slice(0, -1),
            sanitizedString.slice(sanitizedString.length - 1, sanitizedString.length),
        ]
        : sanitizedString);
}
exports.sanitizeIdCardComponent = sanitizeIdCardComponent;
//# sourceMappingURL=sanitize-id-card-component.helper.js.map