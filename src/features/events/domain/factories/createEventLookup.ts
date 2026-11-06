import type { EventLookup } from "../models/EventLookup.ts";

export function createEventLookup(
  title: string,
  from: string,
  to: string,
): EventLookup {
  return { title, from, to };
}
