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

  ".", "_", "-", "$", " "
);
const kSymbolsChar = charSet(",", "{", "}", "[", "]");

export const IDENTIFIERS = new Set([
  "Entity",
  "Unique",
  "PrimaryGeneratedColumn",
  "PrimaryColumn",
  "Column",
  "Generated",
  "JoinTable",
  "JoinColumn",
  "ManyToMany",
  "OneToOne",
  "ManyToOne",
  "OneToMany",
  "CreateDateColumn",
  "UpdateDateColumn",
  "DeleteDateColumn",
  "VersionColumn",
  "Index",
  "EntityRepository"
]);

export type IdentifiersName =
  "Entity" |
  "Unique" |
  "PrimaryGeneratedColumn" |
  "PrimaryColumn" |
  "Column" |
  "Generated" |
  "JoinTable" |
  "JoinColumn" |
  "ManyToMany" |
  "OneToOne" |
  "ManyToOne" |
  "OneToMany" |
  "CreateDateColumn" |
  "UpdateDateColumn" |
  "DeleteDateColumn" |
  "VersionColumn" |
  "Index" |
  "EntityRepository";

export const TOKENS = Object.freeze({
  IDENTIFIER: Symbol("IDENTIFIER"),
  WORD: Symbol("WORD"),
  SYMBOL: Symbol("Symbol")
});

export type TokenizerResult = { token: symbol, raw: string };

function* analyzeStringPattern(currentStr: string): IterableIterator<TokenizerResult> {
  if (IDENTIFIERS.has(currentStr)) {
    yield { token: TOKENS.IDENTIFIER, raw: currentStr };
  }
  else {
    yield { token: TOKENS.WORD, raw: currentStr.trimRight() };
  }
}

export function* tokenize(lineStr: string): IterableIterator<TokenizerResult> {
  let currentStr = "";

  for (const char of lineStr) {
    if (char === " " && currentStr.length === 0) {
      continue;
    }

    if (kWordsChar.has(char)) {
      currentStr += char;
      continue;
    }

    if (currentStr.length > 0) {
      yield* analyzeStringPattern(currentStr);
      currentStr = "";
    }

    if (kSymbolsChar.has(char)) {
      yield { token: TOKENS.SYMBOL, raw: char };
    }
  }

  if (currentStr.length > 0) {
    yield* analyzeStringPattern(currentStr);
  }
}
