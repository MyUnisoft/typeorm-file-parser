// Import Internal Dependencies
import { TOKENS, TokenizerResult } from "../lexer";

// CONSTANTS
const kPropertyConvertor = {
  type: (str) => str,
  name: (str) => str,
  length: (str) => Number(str),
  width: (str) => Number(str),
  precision: (str) => Number(str),
  scale: (str) => Number(str),
  default: (str) => str,
  enum: (str) => str,
  onDelete: (str) => str,
  onUpdate: (str) => str,
  charset: (str) => str,
  referencedColumnName: (str) => str,
  nullable: (str) => str === "true",
  cascade: (str) => str === "true",
  array: (str) => str === "true",
  unique: (str) => str === "true",
  insert: (str) => str === "true",
  select: (str) => str === "true",
  primary: (str) => str === "true",
  comment: (str) => str
};

export type Properties = Record<string, string | boolean | number>;

export function parseDecoratorProperties(iter: IterableIterator<TokenizerResult>): Properties {
  const result = {};
  let currentPropertyName: string | null = null;

  for (const { token, raw: word } of iter) {
    if (token !== TOKENS.WORD) {
      continue;
    }

    if (currentPropertyName === null) {
      if (word in kPropertyConvertor) {
        result[word] = null;
        currentPropertyName = word;
      }
    }
    else {
      result[currentPropertyName] = kPropertyConvertor[currentPropertyName](word);
      currentPropertyName = null;
    }
  }

  return result;
}
