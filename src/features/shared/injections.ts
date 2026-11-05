import { lazy } from "../../core/lazy";
import {
  createGoogleAuthorizationService,
} from "./application/googleAuthorization/GoogleAuthorizationService";
import { GoogleAuthorizationState } from "./application/models/GoogleAuthorizationState";

const googleAuthorizationState = new GoogleAuthorizationState();

export const getGoogleAuthorizationService = lazy(
  () => createGoogleAuthorizationService(googleAuthorizationState),
);
