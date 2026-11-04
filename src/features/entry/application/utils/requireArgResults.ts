import type { ArgResults } from "@argetim/arg-parser";

export function requireArgResults(command: {
  argResults: ArgResults | undefined;
  name: string;
}): ArgResults {
  if (!command.argResults) {
    throw new Error(`Arguments for "${command.name}" were not parsed.`);
  }
  return command.argResults;
}
