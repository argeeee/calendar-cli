import { type calendar_v3, google } from "googleapis";
import { failure, type Result, success } from "../../../../core";
import type {
  GoogleAuthorizationService,
} from "../../../shared/application/googleAuthorization/GoogleAuthorizationService";
import type { EventError } from "../../domain/errors/EventError";

export class GoogleCalendarClient {
  public constructor(
    private readonly authorization: GoogleAuthorizationService,
  ) {}

  public async get(
    requireCalendarScope = false,
  ): Promise<Result<calendar_v3.Calendar, EventError>> {
    const client = await this.authorization.getAuthorizedClient(
      false,
      requireCalendarScope,
    );
    if (!client.hasValue) {
      return failure({
        kind: client.error.type === "CONFIGURATION" ? "configuration" :
          client.error.type === "AUTHORIZATION" ? "authorization" :
          client.error.type === "NETWORK" ? "network" : "unexpected",
        message: client.error.message,
      });
    }

    return success(google.calendar({ version: "v3", auth: client.value }));
  }
}
