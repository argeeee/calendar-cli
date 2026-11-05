import type { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { failure, success } from "../../../../core/Result";
import type { Result } from "../../../../core/Result";
import type { GoogleFailure } from "../failures/GoogleFailure";
import type {
  GoogleAuthorizationOptions,
} from "../models/GoogleAuthorizationOptions";
import type { GoogleAuthorizationState } from "../models/GoogleAuthorizationState";
import type { GoogleOAuthAuthorizer } from "./GoogleOAuthAuthorizer";
import type { GoogleTokenReader } from "./GoogleTokenReader";
import type { GoogleTokenWriter } from "./GoogleTokenWriter";

const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar";
const TASKS_SCOPE = "https://www.googleapis.com/auth/tasks";

export class GoogleAuthorizationService {
  private readonly environment: NodeJS.ProcessEnv;
  constructor(
    private readonly state: GoogleAuthorizationState,
    private readonly tokenReader: GoogleTokenReader,
    private readonly tokenWriter: GoogleTokenWriter,
    private readonly oauthAuthorizer: GoogleOAuthAuthorizer,
    options: GoogleAuthorizationOptions = {},
  ) {
    this.environment = options.environment ?? process.env;
  }

  async getAuthorizedClient(
    requireTasksScope = false,
    requireCalendarScope = false,
  ): Promise<Result<OAuth2Client, GoogleFailure>> {
    const client = this.getClient();
    if (!client) return failure(this.configurationFailure());

    try {
      const hasStoredCredentials = await this.restoreStoredCredentials(
        client,
        requireTasksScope,
        requireCalendarScope,
      );
      if (
        hasStoredCredentials &&
        await this.hasValidAccessToken(client)
      ) {
        return success(client);
      }

      return success(await this.authorizeAndStore(client));
    } catch (error) {
      return failure(this.mapFailure(error));
    }
  }

  private getClient(): OAuth2Client | undefined {
    const clientId = this.environment.GOOGLE_CLIENT_ID;
    const clientSecret = this.environment.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) return undefined;

    this.state.client ??= new google.auth.OAuth2(clientId, clientSecret);
    return this.state.client;
  }

  private configurationFailure(): GoogleFailure {
    return {
      type: "CONFIGURATION",
      message:
        "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment " +
        "or .env file.",
    };
  }

  private async restoreStoredCredentials(
    client: OAuth2Client,
    requireTasksScope: boolean,
    requireCalendarScope: boolean,
  ): Promise<boolean> {
    const stored = await this.tokenReader.read();
    if (
      !stored ||
      !this.hasRequiredScopes(
        stored.scope,
        requireTasksScope,
        requireCalendarScope,
      )
    ) {
      return false;
    }

    client.setCredentials(stored);
    return true;
  }

  private hasRequiredScopes(
    scope: string | undefined,
    requireTasksScope: boolean,
    requireCalendarScope: boolean,
  ): boolean {
    const scopes = scope?.split(" ") ?? [];
    return (!requireCalendarScope || scopes.includes(CALENDAR_SCOPE)) &&
      (!requireTasksScope || scopes.includes(TASKS_SCOPE));
  }

  private async hasValidAccessToken(client: OAuth2Client): Promise<boolean> {
    try {
      await client.getAccessToken();
      return true;
    } catch {
      // Reauthorize when credentials are missing or cannot be refreshed.
      return false;
    }
  }

  private async authorizeAndStore(client: OAuth2Client): Promise<OAuth2Client> {
    const token = await this.oauthAuthorizer.authorize(client);
    client.setCredentials(token);
    await this.tokenWriter.write(token);
    return client;
  }

  private mapFailure(error: unknown): GoogleFailure {
    if (
      error instanceof Error &&
      /authorization|consent|callback|Token file/i.test(error.message)
    ) {
      return { type: "AUTHORIZATION", message: error.message };
    }

    if (
      error instanceof Error &&
      /network|fetch|ENOTFOUND|ECONNRESET/i.test(error.message)
    ) {
      return {
        type: "NETWORK",
        message:
          "Could not reach Google services. Check your network connection " +
          "and try again.",
      };
    }

    return {
      type: "UNEXPECTED",
      message: "Google authorization could not complete the request.",
    };
  }
}
