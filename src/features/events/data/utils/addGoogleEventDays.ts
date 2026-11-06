export function addGoogleEventDays(value: string, amount: number): string {
  const [year = 0, month = 1, day = 1] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + amount));

  return date.toISOString().slice(0, 10);
}
