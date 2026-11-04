import { parseArgs } from "./cli/CreateParser";

const result = await parseArgs(process.argv.slice(2));

if (result !== null) {
  console.log(result.kind);
}
