import type { EventPatch } from "../models/EventPatch.ts";

export function createEventPatch(fields: EventPatch): EventPatch {
  return { ...fields };
}
