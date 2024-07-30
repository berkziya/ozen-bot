/**
 * Removes dots from a string and returns the resulting number.
 * @param str - The string to remove dots from.
 * @returns The resulting number after removing dots.
 */
export declare function dotless(str: string): number;
/**
 * Converts a string to camel case.
 * @param str - The string to convert.
 * @returns The camel case version of the string.
 */
export declare function toCamelCase(str: string): string;
/**
 * Converts a number to slang representation.
 * @param number - The number to convert.
 * @param alternative - Whether to use alternative slang [K, M, G, T, P]
 * @param figures - The number of decimal figures to include.
 * @returns The slang representation of the number.
 */
export declare function numToSlang(number: number, alternative?: boolean, figures?: number): string;
/**
 * Converts a slang representation to a number.
 * @param slang - The slang representation to convert.
 * @returns The resulting number.
 */
export declare function slangToNum(slang: string | number): number;
