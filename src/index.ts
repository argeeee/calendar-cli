import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { parseArgs } from "./features/entry/application/parser/createParser";
import { dispatchCommand } from "./features/entry/application/dispatchCommand";

if (existsSync(".env")) {
  loadEnvFile();
}

const command = await parseArgs(process.argv.slice(2));
if (command !== null) {
  await dispatchCommand(command);
}
