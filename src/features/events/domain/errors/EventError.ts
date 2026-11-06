export type EventErrorBase = {
  kind: string;
  message: string;
};

export type EventConfigurationError = EventErrorBase & {
  kind: "configuration";
};
export type EventAuthorizationError = EventErrorBase & {
  kind: "authorization";
};
export type EventPermissionError = EventErrorBase & { kind: "permission" };
export type EventNotFoundError = EventErrorBase & { kind: "not-found" };
export type EventAmbiguousError = EventErrorBase & { kind: "ambiguous" };
export type EventValidationError = EventErrorBase & { kind: "validation" };
export type EventNetworkError = EventErrorBase & { kind: "network" };
export type EventUnexpectedError = EventErrorBase & { kind: "unexpected" };

export type EventError =
  | EventConfigurationError
  | EventAuthorizationError
  | EventPermissionError
  | EventNotFoundError
  | EventAmbiguousError
  | EventValidationError
  | EventNetworkError
  | EventUnexpectedError;
