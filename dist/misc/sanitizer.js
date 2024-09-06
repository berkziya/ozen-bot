"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.truncate = truncate;
exports.sanitizer = sanitizer;
const illegalRe = /[/?<>\\:*|"]/g;
const controlRe = /[\x00-\x1f\x80-\x9f]/g;
const reservedRe = /^\.+$/;
const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
const windowsTrailingRe = /[. ]+$/;
function truncate(sanitized, length) {
    const uint8Array = new TextEncoder().encode(sanitized);
    const truncated = uint8Array.slice(0, length);
    return new TextDecoder().decode(truncated);
}
function sanitizer(input, replacement = '') {
    const sanitized = input
        .replace(illegalRe, replacement)
        .replace(controlRe, replacement)
        .replace(reservedRe, replacement)
        .replace(windowsReservedRe, replacement)
        .replace(windowsTrailingRe, replacement);
    return truncate(sanitized, 255);
}
