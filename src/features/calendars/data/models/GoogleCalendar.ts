import type { calendar_v3 } from "googleapis";

export type GoogleCalendar = calendar_v3.Schema$Calendar &
  Pick<calendar_v3.Schema$CalendarListEntry, "primary" | "accessRole">;
