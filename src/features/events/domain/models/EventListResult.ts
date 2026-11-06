import type { Event } from "../entities/Event.ts";

export type EventListResult = {
  events: Event[];
  limit: number;
  offset: number;
};
