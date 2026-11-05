import type { BrowserOpener } from "../../domain/services/BrowserOpener";

export type GoogleAuthorizationOptions = {
  projectDirectory?: string;
  browserOpener?: BrowserOpener;
  environment?: NodeJS.ProcessEnv;
};
