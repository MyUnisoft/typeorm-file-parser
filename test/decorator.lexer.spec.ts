// Import Third-party Dependencies
import is from "@slimio/is";

// Import Internal Dependencies
import * as Lexer from "../src/decorator/lexer";
import "./helpers/custom-matcher";

describe("IDENTIFIERS", () => {
  it("should be an ECMAScript 6 Set", () => {
    expect(is.set(Lexer.IDENTIFIERS)).toBeTruthy();
  });

  it("should contains only string primitive", () => {
    for (const value of Lexer.IDENTIFIERS) {
      expect(typeof value).toStrictEqual("string");
    }
  });
});

describe("TOKENS", () => {
  it("should be frozen", () => {
    expect(Object.isFrozen(Lexer.TOKENS)).toBeTruthy();
  });

  it("should contains only three kind of TOKENS (IDENTIFIER, WORD and SYMBOL)", () => {
    const keys = Object.keys(Lexer.TOKENS);

    expect(keys.length).toStrictEqual(3);
    expect(keys).toMatchObject(["IDENTIFIER", "WORD", "SYMBOL"]);
  });

  it("should contains only unique value (symbol primitive)", () => {
    for (const value of Object.values(Lexer.TOKENS)) {
      expect(typeof value).toStrictEqual("symbol");
    }
  });
});

describe("tokenize", () => {
  it("should be able to match a WORD with space in it", () => {
    const iter = Lexer.tokenize("hello world");

    expect(iter).toBeIterableValue({
      token: Lexer.TOKENS.WORD, raw: "hello world"
    });
    expect(iter).toBeEOS();
  });

  it("should be able to tokenize all available (and exported) IDENTIFIERS", () => {
    for (const decoratorName of Lexer.IDENTIFIERS) {
      const iter = Lexer.tokenize(`@${decoratorName}()`);

      expect(iter).toBeIterableValue({
        token: Lexer.TOKENS.IDENTIFIER, raw: decoratorName
      });
      expect(iter).toBeEOS();
    }
  });

  it("should be able to tokenize a simple 'Column' decorator", () => {
    const iter = Lexer.tokenize("@Column('varchar')");

    expect(iter).toBeIterableValue({
      token: Lexer.TOKENS.IDENTIFIER, raw: "Column"
    });
    expect(iter).toBeIterableValue({
      token: Lexer.TOKENS.WORD, raw: "varchar"
    });
    expect(iter).toBeEOS();
  });

  it("should be able to tokenize all symbols", () => {
    const iter = Lexer.tokenize(",${}[]_");

    expect(iter).toBeIterableValue({ token: Lexer.TOKENS.SYMBOL, raw: "," });
    expect(iter).toBeIterableValue({
      token: Lexer.TOKENS.WORD, raw: "$"
    });
    expect(iter).toBeIterableValue({ token: Lexer.TOKENS.SYMBOL, raw: "{" });
    expect(iter).toBeIterableValue({ token: Lexer.TOKENS.SYMBOL, raw: "}" });
    expect(iter).toBeIterableValue({ token: Lexer.TOKENS.SYMBOL, raw: "[" });
    expect(iter).toBeIterableValue({ token: Lexer.TOKENS.SYMBOL, raw: "]" });
    expect(iter).toBeIterableValue({
      token: Lexer.TOKENS.WORD, raw: "_"
    });
    expect(iter).toBeEOS();
  });

  it("should be able to match a WORD and trimRight", () => {
    const iter = Lexer.tokenize("foobar  ,test ");

    expect(iter).toBeIterableValue({
      token: Lexer.TOKENS.WORD, raw: "foobar"
    });
    expect(iter).toBeIterableValue({ token: Lexer.TOKENS.SYMBOL, raw: "," });
    expect(iter).toBeIterableValue({
      token: Lexer.TOKENS.WORD, raw: "test"
    });
    expect(iter).toBeEOS();
  });

  it("should end (EOS) the tokenizer if we provide an empty string", () => {
    const iter = Lexer.tokenize("    ");
    expect(iter).toBeEOS();
  });
});

describe("tokenize (with real world decorators)", () => {
  it("should properly tokenize @Unique decorator", () => {
    const iter = Lexer.tokenize("@Unique(\"GiArticle_reference\", [\"reference\"])");

    expect(iter).toBeIterableValue({
      token: Lexer.TOKENS.IDENTIFIER, raw: "Unique"
    });
    expect(iter).toBeIterableValue({
      token: Lexer.TOKENS.WORD, raw: "GiArticle_reference"
    });
    expect(iter).toBeIterableValue({ token: Lexer.TOKENS.SYMBOL, raw: "," });
    expect(iter).toBeIterableValue({ token: Lexer.TOKENS.SYMBOL, raw: "[" });
    expect(iter).toBeIterableValue({
      token: Lexer.TOKENS.WORD, raw: "reference"
    });
    expect(iter).toBeIterableValue({ token: Lexer.TOKENS.SYMBOL, raw: "]" });
    expect(iter).toBeEOS();
  });

  it("should properly tokenize @Column decorator (with properties)", () => {
    const iter = Lexer.tokenize("@Column({ type: \"enum\", enum: periodicity })");

    expect(iter).toBeIterableValue({
      token: Lexer.TOKENS.IDENTIFIER, raw: "Column"
    });
    expect(iter).toBeIterableValue({ token: Lexer.TOKENS.SYMBOL, raw: "{" });

    expect(iter).toBeIterableValue({
      token: Lexer.TOKENS.WORD, raw: "type"
    });
    expect(iter).toBeIterableValue({
      token: Lexer.TOKENS.WORD, raw: "enum"
    });

    expect(iter).toBeIterableValue({ token: Lexer.TOKENS.SYMBOL, raw: "," });
    expect(iter).toBeIterableValue({
      token: Lexer.TOKENS.WORD, raw: "enum"
    });
    expect(iter).toBeIterableValue({
      token: Lexer.TOKENS.WORD, raw: "periodicity"
    });

    expect(iter).toBeIterableValue({ token: Lexer.TOKENS.SYMBOL, raw: "}" });
    expect(iter).toBeEOS();
  });

  it("should properly tokenize @ManyToMany decorator", () => {
    const iter = Lexer.tokenize("@ManyToMany(() => GiMission, (table) => table.articles)");

    expect(iter).toBeIterableValue({
      token: Lexer.TOKENS.IDENTIFIER, raw: "ManyToMany"
    });

    expect(iter).toBeIterableValue({
      token: Lexer.TOKENS.WORD, raw: "GiMission"
    });
    expect(iter).toBeIterableValue({ token: Lexer.TOKENS.SYMBOL, raw: "," });

    expect(iter).toBeIterableValue({
      token: Lexer.TOKENS.WORD, raw: "table"
    });
    expect(iter).toBeIterableValue({
      token: Lexer.TOKENS.WORD, raw: "table.articles"
    });

    expect(iter).toBeEOS();
  });

  it("should properly tokenize @JoinTable decorator", () => {
    const iter = Lexer.tokenize("@JoinTable({ name: \"gi_articles_missions\" })");

    expect(iter).toBeIterableValue({
      token: Lexer.TOKENS.IDENTIFIER, raw: "JoinTable"
    });

    expect(iter).toBeIterableValue({ token: Lexer.TOKENS.SYMBOL, raw: "{" });
    expect(iter).toBeIterableValue({
      token: Lexer.TOKENS.WORD, raw: "name"
    });

    expect(iter).toBeIterableValue({
      token: Lexer.TOKENS.WORD, raw: "gi_articles_missions"
    });
    expect(iter).toBeIterableValue({ token: Lexer.TOKENS.SYMBOL, raw: "}" });

    expect(iter).toBeEOS();
  });
});

