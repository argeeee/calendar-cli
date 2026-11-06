import { parseArgs } from "./features/entry/application/parser/createParser";
import { dispatchCommand } from "./features/entry/application/dispatchCommand";

const command = await parseArgs(process.argv.slice(2));
if (command !== null) {
  await dispatchCommand(command);
}
