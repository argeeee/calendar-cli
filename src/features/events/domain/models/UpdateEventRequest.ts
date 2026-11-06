import type { EventPatch } from "./EventPatch.ts";

export type UpdateEventRequest = {
  calendarId?: string;
  id: string;
  patch: EventPatch;
};
