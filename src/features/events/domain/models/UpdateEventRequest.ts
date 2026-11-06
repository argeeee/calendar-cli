import type { EventPatch } from "./EventPatch.ts";

export type UpdateEventRequest = { id: string; patch: EventPatch };
