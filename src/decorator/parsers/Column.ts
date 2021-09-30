// Import Internal Dependencies
import { TOKENS, TokenizerResult } from "../lexer";
import { getNextItem, END_OF_SEQUENCE } from "../../utils";
import { parseDecoratorProperties, Properties } from "./Properties";

export type ColumnKind = "PrimaryColumn" | "Column" | "Generated";

export interface ColumnDecorator {
  name: ColumnKind;
  type: string;
  properties: Properties;
}

export default function Column(iter: IterableIterator<TokenizerResult>, name: ColumnKind): ColumnDecorator {
  let type = "";
  let properties: Properties = {};

  const item = getNextItem(iter);
  if (item !== END_OF_SEQUENCE) {
    const isWord = item.token === TOKENS.WORD;
    if (isWord) {
      type = item.raw;
      iter.next();
    }

    const propertyItem = isWord ? getNextItem(iter) : item;
    if (propertyItem !== END_OF_SEQUENCE && propertyItem.token === TOKENS.SYMBOL && propertyItem.raw === "{") {
      properties = parseDecoratorProperties(iter);
    }

    // Asign column type from properties
    if (type === "" && "type" in properties) {
      type = properties.type as string;
      delete properties.type;
    }
  }

  return {
    name,
    type,
    properties
  };
}
