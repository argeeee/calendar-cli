import type { GoogleEventRangeBoundary } from "../models/GoogleEventRangeBoundary";
import { isGoogleEventDateOnly } from "./isGoogleEventDateOnly";

export function toGoogleEventRangeDateTime(
  value: string,
  boundary: GoogleEventRangeBoundary,
): string {
  if (!isGoogleEventDateOnly(value)) {
    return value;
  }

  const [year = 0, month = 1, day = 1] = value.split("-").map(Number);
  const isStartBoundary = boundary === "start";
  const date = new Date(
    year,
    month - 1,
    day,
    isStartBoundary ? 0 : 23,
    isStartBoundary ? 0 : 59,
    isStartBoundary ? 0 : 59,
    isStartBoundary ? 0 : 999,
  );

  return date.toISOString();
}
