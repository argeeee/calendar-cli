import type { Event } from "../entities/Event.ts";

export type CreateEventRequest = { event: Omit<Event, "id"> };
