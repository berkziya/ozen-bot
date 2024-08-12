export function getTimestamp(text: string): Date | null {
  const match = text
    .replace(/\s+/g, ' ')
    .match(/((\w+ \d+:\d+)|(\d+ \w+ \d+ \d+:\d+))/);
  if (match) {
    let dateTimeStr = match[1].toLowerCase();
    const now = new Date();
    if (dateTimeStr.includes('today')) {
      dateTimeStr = dateTimeStr.replace(
        'today',
        `${now.getUTCDate()} ${now.toLocaleString('default', {
          month: 'long',
        })} ${now.getUTCFullYear()}`
      );
    } else if (dateTimeStr.includes('tomorrow')) {
      const tomorrow = new Date(now);
      tomorrow.setUTCDate(now.getUTCDate() + 1);
      dateTimeStr = dateTimeStr.replace(
        'tomorrow',
        `${tomorrow.getUTCDate()} ${tomorrow.toLocaleString('default', {
          month: 'long',
        })} ${tomorrow.getUTCFullYear()}`
      );
    }

    const formats = ['dd MMMM yyyy HH:mm', 'dd MM yyyy HH:mm', 'dd MMMM HH:mm'];

    for (const format of formats) {
      const parsedDate = parseDate(dateTimeStr, format);
      if (parsedDate) {
        return parsedDate;
      }
    }
  }
  return null;
}

function parseDate(dateStr: string, format: string): Date | null {
  const parts = dateStr.split(/[\s:]+/);
  const formatParts = format.split(/[\s:]+/);
  const date = new Date(Date.UTC(0, 0, 1, 0, 0, 0));

  for (let i = 0; i < formatParts.length; i++) {
    const part = formatParts[i];
    const value = parseInt(parts[i], 10);
    switch (part) {
      case 'dd':
        date.setUTCDate(value);
        break;
      case 'MMMM':
        date.setUTCMonth(
          new Date(Date.parse(parts[i] + ' 1, 2000')).getMonth()
        );
        break;
      case 'MM':
        date.setUTCMonth(value - 1);
        break;
      case 'yyyy':
        date.setUTCFullYear(value);
        break;
      case 'HH':
        date.setUTCHours(value);
        break;
      case 'mm':
        date.setUTCMinutes(value);
        break;
    }
  }

  return isNaN(date.getTime()) ? null : date;
}
