"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dotless = dotless;
exports.toCamelCase = toCamelCase;
exports.numToSlang = numToSlang;
exports.slangToNum = slangToNum;
/**
 * Removes dots from a string and returns the resulting number.
 * @param str - The string to remove dots from.
 * @returns The resulting number after removing dots.
 */
function dotless(str) {
    return parseInt(str.match(/\d+/g)?.join('')) || 0;
}
/**
 * Converts a string to camel case.
 * @param str - The string to convert.
 * @returns The camel case version of the string.
 */
function toCamelCase(str) {
    return str
        .replace(/\u00a0/g, ' ')
        .replace(/[^a-zA-Z0-9 ]+/g, '')
        .toLowerCase()
        .replace(/ +(.)/g, (m, chr) => chr.toUpperCase());
}
/**
 * Converts a number to slang representation.
 * @param number - The number to convert.
 * @param alternative - Whether to use alternative slang [K, M, G, T, P]
 * @param figures - The number of decimal figures to include.
 * @returns The slang representation of the number.
 */
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
/**
 * Converts a slang representation to a number.
 * @param slang - The slang representation to convert.
 * @returns The resulting number.
 */
function slangToNum(slang) {
    if (typeof slang === 'number') {
        return slang;
    }
    slang = slang.toLowerCase().replace(/k/, '000').replace('t', '0'.repeat(12));
    return parseInt(slang.replace(/\D/g, ''));
}
