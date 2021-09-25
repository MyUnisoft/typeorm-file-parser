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
const kSymbolsChar = charSet(",", "{", "}", "[", "]");

export const IDENTIFIERS = new Set([
  "Entity",
  "Unique",
  "PrimaryGeneratedColumn",
  "Column",
  "JoinTable",
  "JoinColumn",
  "ManyToMany",
  "OneToOne",
  "ManyToOne",
  "OneToMany"
]);

export const TOKENS = Object.freeze({
  IDENTIFIER: Symbol("IDENTIFIER"),
  WORD: Symbol("WORD"),
  SYMBOL: Symbol("Symbol")
});

export type TokenizerResult = { token: symbol, raw: string };

export function* tokenize(lineStr: string): IterableIterator<TokenizerResult> {
  let currentStr = "";

  for (const char of lineStr) {
    if (kWordsChar.has(char)) {
      currentStr += char;
      continue;
    }

    if (currentStr.length > 0) {
      if (IDENTIFIERS.has(currentStr)) {
        yield { token: TOKENS.IDENTIFIER, raw: currentStr };
      }
      else {
        yield { token: TOKENS.WORD, raw: currentStr };
      }
      currentStr = "";
    }

    if (kSymbolsChar.has(char)) {
      yield { token: TOKENS.SYMBOL, raw: char };
    }
  }
}
