import type { EventFailure } from "../../../shared/domain/failures/EventFailure";

export function createGoogleEventError(error: unknown): EventFailure {
  const status = typeof error === "object" && error !== null && "code" in error
    ? Number(error.code)
    : undefined;
  if (status === 401) {
    return {
      type: "AUTHORIZATION",
      message:
        "Google authorization expired. Complete authorization in the browser " +
          "and try again.",
    };
  }
  if (status === 403) {
    return {
      type: "PERMISSION",
      message:
        "Your Google account does not have permission to manage this calendar.",
    };
  }
  if (status === 404) {
    return {
      type: "NOT_FOUND",
      message: "The requested calendar event was not found.",
    };
  }
  if (status !== undefined && status >= 400 && status < 500) {
    return {
      type: "VALIDATION",
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
      type: "NETWORK",
      message:
        "Could not reach Google Calendar. Check your network connection and " +
          "try again.",
    };
  }
  return {
    type: "UNEXPECTED",
    message: "Google Calendar could not complete the request.",
  };
}
