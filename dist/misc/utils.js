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
        units = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
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
    const match = slang.match(/(\d+(\.\d+)?)\s*([kKtTpP]+)?/);
    if (match) {
        const number = parseFloat(match[1]);
        const unit = match[3];
        if (!unit) {
            return number;
        }
        switch (unit) {
            case 'k':
                return number * 1e3;
            case 'kk':
                return number * 1e6;
            case 'k' + 'kk':
                return number * 1e9;
            case 't':
                return number * 1e12;
            case 'p':
                return number * 1e15;
            default:
                return number;
        }
    }
    return null;
}
