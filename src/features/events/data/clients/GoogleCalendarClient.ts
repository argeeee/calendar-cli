import { type calendar_v3, google } from "googleapis";
import { failure, type Result, success } from "../../../../core";
import type {
  GoogleAuthorizationService,
} from "../../../shared/application/googleAuthorization/GoogleAuthorizationService";
import type { EventFailure } from "../../domain/failures/EventFailure";

export class GoogleCalendarClient {
  public constructor(
    private readonly authorization: GoogleAuthorizationService,
  ) {}

  public async get(): Promise<Result<calendar_v3.Calendar, EventFailure>> {
    const client = await this.authorization.getAuthorizedClient();
    if (!client.hasValue) {
      return failure({
        type: client.error.type === "CONFIGURATION" ? "CONFIGURATION" :
          client.error.type === "AUTHORIZATION" ? "AUTHORIZATION" :
          client.error.type === "NETWORK" ? "NETWORK" : "UNEXPECTED",
        message: client.error.message,
      });
    }

    return success(google.calendar({ version: "v3", auth: client.value }));
  }
}
