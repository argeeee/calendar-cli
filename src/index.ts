import { parseArgs } from "./features/entry/application/parser/createParser";

await parseArgs(process.argv.slice(2));
