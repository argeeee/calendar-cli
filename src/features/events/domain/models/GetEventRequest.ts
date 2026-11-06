import type { EventLookup } from "./EventLookup.ts";

export type GetEventRequest = {
  calendarId?: string;
  target: string | EventLookup;
};
