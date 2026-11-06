import type { Event } from "../entities/Event.ts";

export type CreateEventRequest = {
  calendarId?: string;
  event: Omit<Event, "id">;
};
