export type Calendar = {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  timeZone?: string;
  primary?: boolean;
  accessRole?: string;
};
