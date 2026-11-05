import type { Failure } from "../../../../core/Failure";

export interface GoogleFailureBase extends Failure {
  message: string;
}

export interface GoogleConfigurationFailure extends GoogleFailureBase {
  type: "CONFIGURATION";
}

export interface GoogleAuthorizationFailure extends GoogleFailureBase {
  type: "AUTHORIZATION";
}

export interface GoogleNetworkFailure extends GoogleFailureBase {
  type: "NETWORK";
}

export interface GoogleUnexpectedFailure extends GoogleFailureBase {
  type: "UNEXPECTED";
}

export type GoogleFailure =
  | GoogleConfigurationFailure
  | GoogleAuthorizationFailure
  | GoogleNetworkFailure
  | GoogleUnexpectedFailure;
