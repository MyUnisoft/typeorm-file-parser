// Import Internal Dependencies
import Column from "../../src/decorator/parsers/Column";
import * as Lexer from "../../src/decorator/lexer";

import "../helpers/custom-matcher";

describe("Column (with no properties)", () => {
  it("should be able to parse a @Column decorator with only a WORD type", () => {
    const iter = Lexer.tokenize("@Column(\"varchar\")");
    iter.next();

    const received = Column(iter, "Column");
    expect(iter).toBeEOS();

    expect(received).toMatchObject({
      name: "Column",
      type: "varchar",
      properties: {}
    });
  });

  it("should be able to parse a @PrimaryColumn decorator", () => {
    const iter = Lexer.tokenize("@PrimaryColumn()");
    iter.next();

    const received = Column(iter, "PrimaryColumn");
    expect(iter).toBeEOS();

    expect(received).toMatchObject({
      name: "PrimaryColumn",
      type: "",
      properties: {}
    });
  });

  it("should be able to parse a @Column decorator with only a WORD type", () => {
    const iter = Lexer.tokenize("@Column(\"varchar\")");
    iter.next();

    const received = Column(iter, "Column");
    expect(iter).toBeEOS();

    expect(received).toMatchObject({
      name: "Column",
      type: "varchar",
      properties: {}
    });
  });
});

describe("Column (with properties)", () => {
  it("should be able to parse a @Column decorator with type and properties", () => {
    const iter = Lexer.tokenize("@Column(\"boolean\", { length: \"6\", nullable: false, default: true })");
    iter.next();

    const received = Column(iter, "Column");
    expect(iter).toBeEOS();

    expect(received).toMatchObject({
      name: "Column",
      type: "boolean",
      properties: {
        length: 6,
        nullable: false,
        default: "true"
      }
    });
  });

  it("should be able to parse a @Column decorator with no WORD type", () => {
    const iter = Lexer.tokenize("@Column({ type: \"enum\", enum: giTypeArticle })");
    iter.next();

    const received = Column(iter, "Column");
    expect(iter).toBeEOS();

    expect(received).toMatchObject({
      name: "Column",
      type: "enum",
      properties: {
        enum: "giTypeArticle"
      }
    });
  });
});
