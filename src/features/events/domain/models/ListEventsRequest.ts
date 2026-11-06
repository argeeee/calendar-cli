export type ListEventsRequest = {
  calendarId?: string;
  from: string;
  to: string;
  limit: number;
  offset: number;
};
