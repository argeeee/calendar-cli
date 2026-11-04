import type { Result } from "./Result";

export interface SyncUseCase<Input, Output, Error = unknown> {
  execute(input: Input): Result<Output, Error>;
}
