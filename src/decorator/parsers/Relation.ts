// Import Internal Dependencies
import { TOKENS, TokenizerResult } from "../lexer";
import { getNextItem, END_OF_SEQUENCE } from "../../utils";
import { ParsingError } from "../errors";
import { parseDecoratorProperties, Properties } from "./Properties";

export type RelationKind = "ManyToMany" | "OneToOne" | "ManyToOne" | "OneToMany";

export interface RelationDecorator {
  name: RelationKind;
  table: string;
  tableColumn: string;
  properties: Properties;
}

export default function Relation(iter: IterableIterator<TokenizerResult>, relationName: RelationKind): RelationDecorator {
  const table = getNextWord(iter);
  iter.next();
  iter.next();
  const tableColumn = getNextWord(iter);

  iter.next();
  const propertyItem = getNextItem(iter);

  let properties: Properties = {};
  if (propertyItem !== END_OF_SEQUENCE && propertyItem.token === TOKENS.SYMBOL && propertyItem.raw === "{") {
    properties = parseDecoratorProperties(iter);
  }

  return {
    name: relationName,
    table,
    tableColumn: tableColumn.includes(".") ? tableColumn.split(".")[1] : tableColumn,
    properties
  };
}

function getNextWord(iter: IterableIterator<TokenizerResult>): string {
  const item = getNextItem(iter);
  if (item === END_OF_SEQUENCE) {
    throw new ParsingError("EOS");
  }

  if (item.token !== TOKENS.WORD) {
    throw new ParsingError("EXPECT_WORD");
  }

  return item.raw;
}
