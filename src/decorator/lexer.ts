// Import Internal Dependencies
import { charSet } from "../utils";

// CONSTANTS
const kWordsChar = charSet(
  // 0-9
  [48, 57],

  // a-z
  [65, 90],

  // A-Z
  [97, 122],

  ".", "_", "-", "$"
);
const kSymbolsChar = charSet(",", "{", "}");

const kIdentifiers = new Set([
  "Entity",
  "Unique",
  "PrimaryGeneratedColumn",
  "Column",
  "ManyToMany",
  "OneToOne",
  "ManyToOne",
  "OneToMany",
  "JoinTable",
  "JoinColumn"
]);

export const TOKENS = Object.freeze({
  IDENTIFIER: Symbol("IDENTIFIER"),
  WORD: Symbol("WORD"),
  SYMBOL: Symbol("Symbol")
});

export function* tokenize(lineStr: string): IterableIterator<[symbol, string]> {
  let currentStr = "";

  for (const char of lineStr) {
    if (kWordsChar.has(char)) {
      currentStr += char;
      continue;
    }

    if (currentStr.length > 0) {
      if (kIdentifiers.has(currentStr)) {
        yield [TOKENS.IDENTIFIER, currentStr];
      }
      else {
        yield [TOKENS.WORD, currentStr];
      }
      currentStr = "";
    }

    if (kSymbolsChar.has(char)) {
      yield [TOKENS.SYMBOL, char];
    }
  }
}
