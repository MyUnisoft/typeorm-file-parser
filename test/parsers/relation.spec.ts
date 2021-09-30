// Import Internal Dependencies
import Relation from "../../src/decorator/parsers/Relation";
import { ParsingCodes } from "../../src/decorator/errors";
import * as Lexer from "../../src/decorator/lexer";

import "../helpers/custom-matcher";

describe("Relation (with no properties)", () => {
  it("should be able to parse a @OneToOne relation decorator", () => {
    const iter = Lexer.tokenize("@OneToOne(() => GiArticle, (table) => table.id)");
    iter.next();

    const received = Relation(iter, "OneToOne");
    expect(iter).toBeEOS();

    expect(received).toMatchObject({
      name: "OneToOne",
      table: "GiArticle",
      tableColumn: "id",
      properties: {}
    });
  });

  // it("should be able to parse a @OneToOne relation decorator (with tableColumn destructuration)", () => {
  //   const iter = Lexer.tokenize("@OneToOne(() => GiArticle, ({ id }) => id)");
  //   iter.next();

  //   const received = Relation(iter, "OneToOne");
  //   expect(iter).toBeEOS();

  //   expect(received).toMatchObject({
  //     name: "OneToOne",
  //     table: "GiArticle",
  //     tableColumn: "id",
  //     properties: {}
  //   });
  // });

  it("should throw an EOS Error because the decorator is empty", () => {
    const iter = Lexer.tokenize("@OneToOne()");
    iter.next();

    expect(() => Relation(iter, "OneToOne")).toThrow(ParsingCodes.EOS);
  });

  it("should throw an EXPECT_WORD Error because the Lexer returned a SYMBOL Token instead of a WORD", () => {
    const iter = Lexer.tokenize("@OneToOne(,)");
    iter.next();

    expect(() => Relation(iter, "OneToOne")).toThrow(ParsingCodes.EXPECT_WORD);
  });
});

describe("Relation (with properties)", () => {
  it("should be able to parse a @ManyToOne relation decorator", () => {
    const iter = Lexer.tokenize("@ManyToOne(() => WorkUnit, (table) => table.articles, { nullable: false, cascade: true })");
    iter.next();

    const received = Relation(iter, "ManyToOne");
    expect(iter).toBeEOS();

    expect(received).toMatchObject({
      name: "ManyToOne",
      table: "WorkUnit",
      tableColumn: "articles",
      properties: {
        nullable: false,
        cascade: true
      }
    });
  });
});
