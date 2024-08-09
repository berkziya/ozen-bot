export function dotless(str: string): number {
  const match = str.match(/\d+/g);
  const digits = match ? match.join('') : '0';
  return parseInt(digits, 10);
}

export function toCamelCase(str: string): string {
  return str
    .replace(/\u00a0/g, ' ')
    .replace(/[^a-zA-Z0-9 ]+/g, '')
    .toLowerCase()
    .replace(/ +(.)/g, (m, chr) => chr.toUpperCase());
}

export function numToSlang(
  number: number,
  alternative: boolean = false,
  figures: number = 1
): string {
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

export function slangToNum(slang: string | number): number {
  if (typeof slang === 'number') {
    return slang;
  }
  slang = slang.toLowerCase().replace(/k/, '000').replace('t', '0'.repeat(12));
  return parseInt(slang.replace(/\D/g, ''));
}
