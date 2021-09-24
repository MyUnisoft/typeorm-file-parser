// Import Internal Dependencies
import * as Lexer from "./lexer";

// CONSTANTS
const kPropertyConvertor = {
  length: (str) => Number(str),
  precision: (str) => Number(str),
  scale: (str) => Number(str),
  default: (str) => str,
  type: (str) => str,
  enum: (str) => str,
  onDelete: (str) => str,
  onUpdate: (str) => str,
  nullable: (str) => str === "true",
  cascade: (str) => str === "true",
  array: (str) => str === "true",
  unique: (str) => str === "true"
};

export interface TypeORMDecorator {
  name: string;
  type?: null | string;
  table?: string;
  tableColumn?: string;
  properties: Record<string, any>;
  columns?: string[];
}

export function parseDecorator(lineStr: string): TypeORMDecorator {
  const decorator: TypeORMDecorator = {
    name: "",
    type: null,
    properties: {}
  };
  let enteredInPropertyBlock = false;
  let currentPropertyName: string | null = null;

  for (const [token, word] of Lexer.tokenize(lineStr)) {
    if (token === Lexer.TOKENS.IDENTIFIER) {
      decorator.name = word;
      if (decorator.name === "Unique") {
        decorator.columns = [];
      }
    }

    if (enteredInPropertyBlock) {
      if (token !== Lexer.TOKENS.WORD) {
        continue;
      }

      if (currentPropertyName === null) {
        if (word in kPropertyConvertor) {
          decorator.properties[word] = null;
          currentPropertyName = word;
        }
      }
      else {
        const value = kPropertyConvertor[currentPropertyName](word);
        if (currentPropertyName === "type" && decorator.type === null) {
          decorator.type = value;
          delete decorator.properties[currentPropertyName];
        }
        else {
          decorator.properties[currentPropertyName] = value;
        }

        currentPropertyName = null;
      }

      continue;
    }

    if (token === Lexer.TOKENS.WORD) {
      switch (decorator.name) {
        case "Column":
          decorator.type = word;
          break;
        case "Unique":
          if (decorator.type === null) {
            decorator.type = word;
          }
          else {
            decorator.columns?.push(word);
          }
          break;
        case "ManyToMany":
        case "OneToOne":
        case "ManyToOne":
        case "OneToMany": {
          const side = decorator.table ? "tableColumn" : "table";

          decorator[side] = side === "table" ? word : word.split(".")[1];
          break;
        }
      }
    }
    else if (token === Lexer.TOKENS.SYMBOL && word === "{") {
      enteredInPropertyBlock = true;
    }
  }

  if (decorator.type === null) {
    delete decorator.type;
  }

  return decorator;
}
