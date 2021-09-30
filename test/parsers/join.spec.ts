// Import Internal Dependencies
import Join from "../../src/decorator/parsers/Join";
import { ParsingCodes } from "../../src/decorator/errors";
import * as Lexer from "../../src/decorator/lexer";

import "../helpers/custom-matcher";

describe("Join", () => {
  it("should be able to parse a @JoinColumn decorator with a 'name' properties", () => {
    const iter = Lexer.tokenize("@JoinColumn({ name: \"account_article_id\" })");
    iter.next();

    const received = Join(iter, "JoinColumn");
    expect(iter).toBeEOS();

    expect(received).toMatchObject({
      name: "JoinColumn",
      properties: {
        name: "account_article_id"
      }
    });
  });

  it("should throw an EOS error because there is no properties in the decorator", () => {
    const iter = Lexer.tokenize("@JoinColumn()");
    iter.next();

    expect(() => Join(iter, "JoinColumn")).toThrow(ParsingCodes.EOS);
  });

  it("should throw an EXPECT_PROPERTIES error because the Lexer match a WORD token instead of a SYMBOL '{'", () => {
    const iter = Lexer.tokenize("@JoinColumn(\"varchar\")");
    iter.next();

    expect(() => Join(iter, "JoinColumn")).toThrow(ParsingCodes.EXPECT_PROPERTIES);
  });
});
