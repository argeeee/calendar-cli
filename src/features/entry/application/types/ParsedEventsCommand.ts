export type ParsedEventsCommand =
  | {
      kind: "events.list";
      from: string;
      to: string;
      limit: number;
      offset: number;
    }
  | { kind: "events.labels.list" };
