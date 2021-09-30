// Import Internal Dependencies
import Unique from "../../src/decorator/parsers/Unique";
import { ParsingCodes } from "../../src/decorator/errors";
import * as Lexer from "../../src/decorator/lexer";

import "../helpers/custom-matcher";

describe("Unique", () => {
  it("should be able to parse a @Unique decorator with a constraintName and columns", () => {
    const iter = Lexer.tokenize("@Unique(\"GiArticle_reference\", [\"reference\"])");
    iter.next();

    const received = Unique(iter);
    expect(iter).toBeEOS();

    expect(received).toMatchObject({
      name: "Unique",
      constraintName: "GiArticle_reference",
      columns: ["reference"]
    });
  });

  it("should be able to parse a @Unique decorator with no constraintName", () => {
    const iter = Lexer.tokenize("@Unique([\"foo\", \"bar\"])");
    iter.next();

    const received = Unique(iter);
    expect(iter).toBeEOS();

    expect(received).toMatchObject({
      name: "Unique",
      constraintName: null,
      columns: ["foo", "bar"]
    });
  });

  it("should throw an Error because EOS is not expected (missing constraintName)", () => {
    const iter = Lexer.tokenize("@Unique()");
    iter.next();

    expect(() => Unique(iter)).toThrow(ParsingCodes.EOS);
  });
});
