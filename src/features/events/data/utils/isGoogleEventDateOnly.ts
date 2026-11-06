export function isGoogleEventDateOnly(value: string): boolean {
  const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

  return dateOnlyPattern.test(value);
}
