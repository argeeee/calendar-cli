import type { Event } from "../entities/Event.ts";
import type { EventListResult } from "../models/EventListResult.ts";
import type { EventLookup } from "../models/EventLookup.ts";
import type { EventPatch } from "../models/EventPatch.ts";

export function createEventInput(
  title: string,
  start: string,
  end: string,
  description?: string,
  location?: string,
  colorId?: string,
  eventLabelId?: string,
): Omit<Event, "id"> {
  return {
    title,
    start,
    end,
    ...(description === undefined ? {} : { description }),
    ...(location === undefined ? {} : { location }),
    ...(colorId === undefined ? {} : { colorId }),
    ...(eventLabelId === undefined ? {} : { eventLabelId }),
  };
}

export function createEventLookup(
  title: string,
  from: string,
  to: string,
): EventLookup {
  return { title, from, to };
}

export function createEventPatch(fields: EventPatch): EventPatch {
  return { ...fields };
}

export function createEventListResult(
  events: Event[],
  limit: number,
  offset: number,
): EventListResult {
  return { events, limit, offset };
}
