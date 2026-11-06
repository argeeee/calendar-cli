export function isDateOnly(value: string): boolean {
  const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
  return DATE_ONLY_PATTERN.test(value);
}
