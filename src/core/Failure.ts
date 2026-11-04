export type Failure = {
  type: string;
};

export function isFailure(value: unknown): value is Failure {
  if (!value || typeof value !== "object" || !("type" in value)) {
    return false;
  }

  return typeof value.type === "string";
}
