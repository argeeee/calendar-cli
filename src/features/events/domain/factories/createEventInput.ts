import type { Event } from "../entities/Event.ts";

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
