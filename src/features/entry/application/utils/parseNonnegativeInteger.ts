export function parseNonnegativeInteger(value: string | null): number | undefined {
  if (value !== null && /^\d+$/.test(value)) {
    const parsed = Number(value);
    if (Number.isSafeInteger(parsed)) return parsed;
  }
  return undefined;
}
