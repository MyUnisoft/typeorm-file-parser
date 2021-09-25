// DEPENDENCIES
import ExtendableError from "es6-error";

export const ParsingCodes = Object.freeze({
  EOS: "Abnormal end of sequence detected",
  EXPECT_ID: "Expected an IDENTIFIER",
  EXPECT_WORD: "Expected a WORD"
});

export type KeyCode = keyof typeof ParsingCodes;

export class ParsingError extends ExtendableError {
  public code: KeyCode;

  constructor(code: KeyCode, customMessage = "") {
    super(ParsingCodes[code] + customMessage);
    this.code = code;
  }
}
