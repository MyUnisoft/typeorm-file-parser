// Import Internal Dependencies
import { TOKENS, TokenizerResult } from "../lexer";
import { getNextItem, END_OF_SEQUENCE } from "../../utils";
import { ParsingError } from "../errors";
import { parseDecoratorProperties, Properties } from "./Properties";

export interface ColumnDecorator {
  name: "Column";
  type: string;
  properties: Properties;
}

export default function Column(iter: IterableIterator<TokenizerResult>): ColumnDecorator {
  let type = "";
  let properties: Properties = {};

  const item = getNextItem(iter);
  if (item === END_OF_SEQUENCE) {
    throw new ParsingError("EOS");
  }
  const isFirstItemWord = item.token === TOKENS.WORD;
  if (isFirstItemWord) {
    type = item.raw;
  }

  const propertyItem = isFirstItemWord ? getNextItem(iter) : item;
  if (propertyItem !== END_OF_SEQUENCE && propertyItem.token === TOKENS.SYMBOL && propertyItem.raw === "{") {
    properties = parseDecoratorProperties(iter);
  }

  if (type === "" && "type" in properties) {
    type = properties.type as string;
    delete properties.type;
  }

  return {
    name: "Column",
    type,
    properties
  };
}
