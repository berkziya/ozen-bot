"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dotless = dotless;
exports.toCamelCase = toCamelCase;
exports.numToSlang = numToSlang;
exports.slangToNum = slangToNum;
function dotless(str) {
    const match = str.match(/\d+/g);
    const digits = match ? match.join('') : '0';
    return parseInt(digits, 10);
}
function toCamelCase(str) {
    return str
        .replace(/\u00a0/g, ' ')
        .replace(/[^a-zA-Z0-9 ]+/g, '')
        .toLowerCase()
        .replace(/ +(.)/g, (m, chr) => chr.toUpperCase());
}
function numToSlang(number, alternative = false, figures = 1) {
    let units = ['', 'k', 'kk', 'k' + 'kk', 'T', 'P'];
    if (alternative) {
        units = ['', 'K', 'M', 'G', 'T', 'P'];
    }
    for (let i = 0; i < units.length; i++) {
        if (Math.abs(number) < 1000) {
            return `${number.toFixed(figures)}${units[i]}`;
        }
        number /= 1000;
    }
    return `${number.toFixed(3)}${units[units.length - 1]}`;
}
function slangToNum(slang) {
    if (typeof slang === 'number') {
        return slang;
    }
    slang = slang.toLowerCase().replace(/k/, '000').replace('t', '0'.repeat(12));
    return parseInt(slang.replace(/\D/g, ''));
}
