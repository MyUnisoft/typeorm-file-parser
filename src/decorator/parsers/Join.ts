// Import Internal Dependencies
import { TOKENS, TokenizerResult } from "../lexer";
import { getNextItem, END_OF_SEQUENCE } from "../../utils";
import { parseDecoratorProperties, Properties } from "./Properties";

export type JoinKind = "JoinTable" | "JoinColumn";

export interface JoinDecorator {
  name: JoinKind;
  properties: Properties;
}

export default function Join(iter: IterableIterator<TokenizerResult>, name: JoinKind): JoinDecorator {
  let properties: Properties = {};

  const propertyItem = getNextItem(iter);
  if (propertyItem !== END_OF_SEQUENCE && propertyItem.token === TOKENS.SYMBOL && propertyItem.raw === "{") {
    properties = parseDecoratorProperties(iter);
  }

  return {
    name,
    properties
  };
}
