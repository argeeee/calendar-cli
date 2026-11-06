import type { Event } from "../entities/Event.ts";

export type EventPatch = Partial<
  Pick<
    Event,
    | "title"
    | "start"
    | "end"
    | "description"
    | "location"
    | "colorId"
    | "eventLabelId"
  >
>;
