// Import Internal Dependencies
import { TOKENS, TokenizerResult } from "../lexer";
import { getNextItem, END_OF_SEQUENCE } from "../../utils";
import { ParsingError } from "../errors";

export interface UniqueDecorator {
  name: "Unique";
  constraintName: string | null;
  columns: string[];
}

export default function Unique(iter: IterableIterator<TokenizerResult>): UniqueDecorator {
  const firstValue = getNextItem(iter);
  if (firstValue === END_OF_SEQUENCE) {
    throw new ParsingError("EOS");
  }

  // Sometimes there is no constraint name
  // see: https://typeorm.io/#/decorator-reference/unique
  let constraintName: string | null = null;
  if (firstValue.token === TOKENS.WORD) {
    constraintName = firstValue.raw;
  }

  const columns: string[] = [];
  for (const { token, raw } of iter) {
    if (token === TOKENS.WORD) {
      columns.push(raw);
    }
  }

  return { name: "Unique", constraintName, columns };
}
