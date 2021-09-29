// Import Node.js Dependencies
import { createReadStream } from "fs";

// Import Third-party Dependencies
import split2 from "split2";

// Import Internal Dependencies
import { parseDecorator, TypeORMDecoratorBase, TypeORMDecoratorExtended } from "./decorator/parser";

// CONSTANTS
const kArrobaseChar = "@";
const kSlashChar = "/";

export async function* lazyFetchFileDecorator(fileLocation: string) {
  const rStream = createReadStream(fileLocation).pipe(split2());
  let pastConcat: string | null = null;

  for await (const line of rStream) {
    const trimedLine = line.trim() as string;
    if (trimedLine.includes("export interface")) {
      break;
    }

    const isCommentLine = trimedLine.startsWith(kSlashChar);
    if (isCommentLine) {
      continue;
    }

    const fieldLineResult = /^([a-zA-Z0-9_]+)\s*:\s*([a-zA-Z]+)/g.exec(trimedLine);
    if (fieldLineResult !== null) {
      const [, name, value] = fieldLineResult;
      yield [name, value];

      continue;
    }

    const isEndLine = trimedLine.charAt(trimedLine.length - 1) === ")";
    const isStartLine = trimedLine.startsWith(kArrobaseChar);

    if (isEndLine) {
      const finalPayload = isStartLine ? trimedLine : pastConcat + trimedLine;
      yield parseDecorator(finalPayload);

      pastConcat = null;
      continue;
    }

    pastConcat = (pastConcat || "") + trimedLine;
  }
}

type DecoratorExWithoutName = Omit<TypeORMDecoratorExtended, "name"> | string;

function removeDecoratorName(decorator: TypeORMDecoratorBase): DecoratorExWithoutName {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { name, ...otherProperties } = decorator;
  if (Object.keys(otherProperties).length === 0) {
    return name;
  }

  return otherProperties;
}

export interface TypeORMProperty {
  type: string;
  decorators: Record<string, TypeORMDecoratorBase>;
}

export interface ParsedTypeORMResult {
  unique?: DecoratorExWithoutName;
  properties: Record<string, TypeORMProperty>;
}

export async function readFile(fileLocation: string): Promise<ParsedTypeORMResult> {
  let memoryColumns: TypeORMDecoratorBase[] = [];

  const result: ParsedTypeORMResult = {
    properties: {}
  };
  const asyncIter = await lazyFetchFileDecorator(fileLocation);
  await asyncIter.next();

  for await (const decorator of asyncIter) {
    if (Array.isArray(decorator)) {
      const decorators = {};
      for (const decorator of memoryColumns) {
        decorators[decorator.name] = decorator;
      }

      const [propertyName, propertyValue] = decorator;
      result.properties[propertyName] = {
        type: propertyValue,
        decorators
      };

      memoryColumns = [];
    }
    else if (decorator.name === "Unique") {
      result.unique = removeDecoratorName(decorator);
    }
    else {
      memoryColumns.push(decorator);
    }
  }

  return result;
}
