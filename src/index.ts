// Import Node.js Dependencies
import { createReadStream } from "fs";

// Import Third-party Dependencies
import split2 from "split2";

// Import Internal Dependencies
import { parseDecorator } from "./decorator/intermediateParser";

// CONSTANTS
const kArrobaseChar = "@";

export async function parseTypeORMFile(fileLocation: string) {
  const result = {};
  const rStream = createReadStream(fileLocation).pipe(split2());

  for await (const line of rStream) {
    const trimedLine = line.trim() as string;

    if (trimedLine.startsWith(kArrobaseChar)) {
      console.log(parseDecorator(trimedLine));
    }
  }

  return result;
}
