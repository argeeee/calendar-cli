export function isGoogleEventDateOnly(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function addGoogleEventDays(value: string, amount: number): string {
  const [year = 0, month = 1, day = 1] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + amount)).toISOString().slice(
    0,
    10,
  );
}

export function toGoogleEventRangeDateTime(
  value: string,
  boundary: "start" | "end",
): string {
  if (!isGoogleEventDateOnly(value)) return value;
  const [year = 0, month = 1, day = 1] = value.split("-").map(Number);
  return new Date(
    year,
    month - 1,
    day,
    boundary === "start" ? 0 : 23,
    boundary === "start" ? 0 : 59,
    boundary === "start" ? 0 : 59,
    boundary === "start" ? 0 : 999,
  ).toISOString();
}
