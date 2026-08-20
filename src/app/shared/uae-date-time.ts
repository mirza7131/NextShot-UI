export const UAE_TIME_ZONE = 'Asia/Dubai';
export const UAE_DATE_PIPE_TIME_ZONE = '+0400';

type UaeDateParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
};

const UAE_OFFSET_HOURS = 4;

function getPartMap(date: Date): Record<string, string> {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: UAE_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date).reduce((parts, part) => {
    if (part.type !== 'literal') {
      parts[part.type] = part.value;
    }

    return parts;
  }, {} as Record<string, string>);
}

export function getUaeDateParts(date: Date = new Date()): UaeDateParts {
  const parts = getPartMap(date);

  return {
    year: Number(parts['year']),
    month: Number(parts['month']),
    day: Number(parts['day']),
    hour: Number(parts['hour']),
    minute: Number(parts['minute']),
    second: Number(parts['second'])
  };
}

export function formatUaeDateInput(date: Date = new Date()): string {
  const parts = getUaeDateParts(date);

  return [
    parts.year.toString().padStart(4, '0'),
    parts.month.toString().padStart(2, '0'),
    parts.day.toString().padStart(2, '0')
  ].join('-');
}

export function formatUaeDateTimeLocal(date: Date = new Date()): string {
  const parts = getUaeDateParts(date);

  return `${formatUaeDateInput(date)}T${parts.hour.toString().padStart(2, '0')}:${parts.minute.toString().padStart(2, '0')}`;
}

export function parseUaeDateTimeLocal(value: string): Date {
  const [datePart, timePart = '00:00'] = value.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);

  if (!year || !month || !day || Number.isNaN(hour) || Number.isNaN(minute)) {
    return new Date(NaN);
  }

  return new Date(Date.UTC(year, month - 1, day, hour - UAE_OFFSET_HOURS, minute, 0, 0));
}

export function parseApiDateAsUae(value?: string | Date | null): Date | undefined {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    return value;
  }

  const normalized = value.toString();

  if (/[zZ]$|[+-]\d{2}:?\d{2}$/.test(normalized)) {
    const date = new Date(normalized);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }

  const date = parseUaeDateTimeLocal(normalized.slice(0, 16));
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function toUaeApiDateTime(date: Date = new Date()): string {
  const parts = getUaeDateParts(date);

  return `${formatUaeDateInput(date)}T${parts.hour.toString().padStart(2, '0')}:${parts.minute.toString().padStart(2, '0')}:${parts.second.toString().padStart(2, '0')}`;
}

export function formatUaeDisplayDate(date?: Date, options?: Intl.DateTimeFormatOptions): string {
  if (!date) {
    return '-';
  }

  return new Intl.DateTimeFormat('en-GB', {
    timeZone: UAE_TIME_ZONE,
    dateStyle: 'medium',
    timeStyle: 'short',
    ...options
  }).format(date);
}
