// Import Internal Dependencies
import * as Lexer from "./lexer";
import { getNextItem, END_OF_SEQUENCE } from "../utils";
import { ParsingError } from "./errors";

import Unique, { UniqueDecorator } from "./parsers/Unique";
import Relation, { RelationDecorator } from "./parsers/Relation";
import Column, { ColumnDecorator } from "./parsers/Column";

export type TypeORMDecorator =
  { name: "Entity" | "PrimaryGeneratedColumn" } |
  UniqueDecorator |
  RelationDecorator |
  ColumnDecorator;

export function parseDecorator(lineStr: string): TypeORMDecorator {
  const iter = Lexer.tokenize(lineStr);
  const id = getNextItem(iter);
  if (id === END_OF_SEQUENCE) {
    throw new ParsingError("EOS");
  }
  if (id.token !== Lexer.TOKENS.IDENTIFIER) {
    throw new ParsingError("EXPECT_ID", ", Decorator must always start with @.");
  }

  let decorator: TypeORMDecorator;
  switch (id.raw) {
    case "Unique":
      decorator = Unique(iter);
      break;
    case "Column":
      decorator = Column(iter);
      break;
    case "ManyToMany":
    case "OneToOne":
    case "ManyToOne":
    case "OneToMany":
      decorator = Relation(iter, id.raw);
      break;
    default:
      decorator = { name: id.raw as any };
      break;
  }

  return decorator;
}
