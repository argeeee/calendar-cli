import type { EventError } from "../../domain/errors/EventError";

export function createGoogleEventError(error: unknown): EventError {
  const status = typeof error === "object" && error !== null && "code" in error
    ? Number(error.code)
    : undefined;
  if (status === 401) {
    return {
      kind: "authorization",
      message:
        "Google authorization expired. Complete authorization in the browser " +
          "and try again.",
    };
  }
  if (status === 403) {
    return {
      kind: "permission",
      message:
        "Your Google account does not have permission to manage this calendar.",
    };
  }
  if (status === 404) {
    return {
      kind: "not-found",
      message: "The requested calendar event was not found.",
    };
  }
  if (status !== undefined && status >= 400 && status < 500) {
    return {
      kind: "validation",
      message:
        "Google Calendar rejected this event request. Check the event values " +
          "and try again.",
    };
  }
  if (
    error instanceof Error &&
    /network|fetch|ENOTFOUND|ECONNRESET/i.test(error.message)
  ) {
    return {
      kind: "network",
      message:
        "Could not reach Google Calendar. Check your network connection and " +
          "try again.",
    };
  }
  return {
    kind: "unexpected",
    message: "Google Calendar could not complete the request.",
  };
}
