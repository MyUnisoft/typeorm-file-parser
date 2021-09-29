// Import Internal Dependencies
import * as Lexer from "./lexer";
import { getNextItem, END_OF_SEQUENCE } from "../utils";
import { ParsingError } from "./errors";

import Unique, { UniqueDecorator } from "./parsers/Unique";
import Relation, { RelationDecorator } from "./parsers/Relation";
import Column, { ColumnDecorator } from "./parsers/Column";
import Join, { JoinDecorator } from "./parsers/Join";

export type TypeORMDecoratorExtended = UniqueDecorator | RelationDecorator | ColumnDecorator | JoinDecorator;
export type TypeORMDecoratorBase = { name: "Entity" | "PrimaryGeneratedColumn" } | TypeORMDecoratorExtended;

export function parseDecorator(lineStr: string): TypeORMDecoratorBase {
  const iter = Lexer.tokenize(lineStr);
  const id = getNextItem(iter);
  if (id === END_OF_SEQUENCE) {
    throw new ParsingError("EOS");
  }
  if (id.token !== Lexer.TOKENS.IDENTIFIER) {
    throw new ParsingError("EXPECT_ID", ", Decorator must always start with @.");
  }

  let decorator: TypeORMDecoratorBase;
  switch (id.raw) {
    case "Unique": {
      decorator = Unique(iter);
      break;
    }
    case "PrimaryColumn":
    case "Generated":
    case "Column": {
      decorator = Column(iter, id.raw);
      break;
    }
    case "JoinColumn":
    case "JoinTable": {
      decorator = Join(iter, id.raw);
      break;
    }
    case "ManyToMany":
    case "OneToOne":
    case "ManyToOne":
    case "OneToMany": {
      decorator = Relation(iter, id.raw);
      break;
    }
    default: {
      decorator = { name: id.raw as any };
      break;
    }
  }

  return decorator;
}
