import type { Event } from "../entities/Event.ts";
import type { EventListResult } from "../models/EventListResult.ts";

export function createEventListResult(
  events: Event[],
  limit: number,
  offset: number,
): EventListResult {
  return { events, limit, offset };
}
