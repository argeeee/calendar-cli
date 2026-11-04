import { isValidCalendarDate } from "./isValidCalendarDate";

export function normalizeDate(value: string | null): string | undefined {
  if (value === null) return undefined;

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return isValidCalendarDate(value) ? value : undefined;
  } else {
    const match =
      /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-](\d{2}):(\d{2}))$/
        .exec(value);
    if (
      !match || !match[1] || !match[2] || !match[3] || !match[4] ||
      !isValidCalendarDate(match[1])
    ) {
      return undefined;
    }

    const hour = Number(match[2]);
    const minute = Number(match[3]);
    const second = Number(match[4]);
    const offsetHour = match[7] === undefined ? 0 : Number(match[7]);
    const offsetMinute = match[8] === undefined ? 0 : Number(match[8]);
    if (
      hour > 23 || minute > 59 || second > 59 || offsetHour > 23 ||
      offsetMinute > 59
    ) {
      return undefined;
    }

    const date = new Date(value);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }

  return undefined;
}
