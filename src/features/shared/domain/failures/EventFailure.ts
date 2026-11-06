import type { Failure } from "../../../../core/Failure";

export interface EventFailureBase extends Failure {
  message: string;
}

export interface EventConfigurationFailure extends EventFailureBase {
  type: "CONFIGURATION";
}

export interface EventAuthorizationFailure extends EventFailureBase {
  type: "AUTHORIZATION";
}

export interface EventPermissionFailure extends EventFailureBase {
  type: "PERMISSION";
}

export interface EventNotFoundFailure extends EventFailureBase {
  type: "NOT_FOUND";
}

export interface EventAmbiguousFailure extends EventFailureBase {
  type: "AMBIGUOUS";
}

export interface EventValidationFailure extends EventFailureBase {
  type: "VALIDATION";
}

export interface EventNetworkFailure extends EventFailureBase {
  type: "NETWORK";
}

export interface EventUnexpectedFailure extends EventFailureBase {
  type: "UNEXPECTED";
}

export type EventFailure =
  | EventConfigurationFailure
  | EventAuthorizationFailure
  | EventPermissionFailure
  | EventNotFoundFailure
  | EventAmbiguousFailure
  | EventValidationFailure
  | EventNetworkFailure
  | EventUnexpectedFailure;
