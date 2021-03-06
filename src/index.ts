// Import Node.js Dependencies
import { createReadStream } from "fs";

// Import Third-party Dependencies
import split2 from "split2";

// Import Internal Dependencies
import { IdentifiersName } from "./decorator/lexer";
import {
  parseDecorator, TypeORMDecoratorBase, TypeORMDecoratorExtended,
  UniqueDecorator, RelationDecorator, ColumnDecorator, JoinDecorator
} from "./decorator/parser";

// CONSTANTS
const kArrobaseChar = "@";
const kSlashChar = "/";

export type DecoratorExWithoutName = Omit<TypeORMDecoratorExtended, "name">;

export { IdentifiersName, UniqueDecorator, RelationDecorator, ColumnDecorator, JoinDecorator };

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
    if (pastConcat === null && fieldLineResult !== null) {
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

function removeDecoratorName(decorator: TypeORMDecoratorBase): DecoratorExWithoutName {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { name, ...otherProperties } = decorator;

  return otherProperties;
}

export interface TypeORMProperty {
  /** TypeScript/JavaScript type */
  type: string;

  /** TypeScript (TypeORM) decorators attached to the property */
  decorators: Record<IdentifiersName, TypeORMDecoratorBase>;
}

export interface ParsedTypeORMResult {
  /** Entity Unique decorator (without root name property) */
  unique?: DecoratorExWithoutName;

  /** Entity properties as a plainObject */
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
      const decorators = Object.create(null);
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
