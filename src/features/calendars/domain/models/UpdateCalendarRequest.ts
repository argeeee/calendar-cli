import type { CalendarPatch } from "./CalendarPatch";

export type UpdateCalendarRequest = {
  calendarId?: string;
  patch: CalendarPatch;
};
