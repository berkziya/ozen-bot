const illegalRe = /[/?<>\\:*|"]/g;
const controlRe = /[\x00-\x1f\x80-\x9f]/g;
const reservedRe = /^\.+$/;
const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
const windowsTrailingRe = /[. ]+$/;

export function truncate(sanitized: string, length: number): string {
  const uint8Array = new TextEncoder().encode(sanitized);
  const truncated = uint8Array.slice(0, length);
  return new TextDecoder().decode(truncated);
}

export function sanitizer(input: string, replacement: string = '') {
  const sanitized = input
    .replace(illegalRe, replacement)
    .replace(controlRe, replacement)
    .replace(reservedRe, replacement)
    .replace(windowsReservedRe, replacement)
    .replace(windowsTrailingRe, replacement);
  return truncate(sanitized, 255);
}
