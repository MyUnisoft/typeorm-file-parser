// Import Internal Dependencies
import { ParsingCodes } from "../src/decorator/errors";
import { parseDecorator } from "../src/decorator/parser";
import "./helpers/custom-matcher";

describe("parseDecorator", () => {
  it("should throw EOS for an empty string", () => {
    expect(() => parseDecorator("")).toThrow(ParsingCodes.EOS);
  });

  it("should throw EXPECT_ID because the first TOKEN is a WORD", () => {
    expect(() => parseDecorator("hello")).toThrow(ParsingCodes.EXPECT_ID);
  });

  it("should parse Entity decorator", () => {
    const decorator = parseDecorator("@Entity()");

    expect(decorator).toMatchObject({ name: "Entity" });
  });

  it("should parse Unique decorator", () => {
    const decorator = parseDecorator("@Unique(\"GiArticle_reference\", [\"reference\"])");

    expect(decorator).toMatchObject({
      name: "Unique",
      constraintName: "GiArticle_reference",
      columns: ["reference"]
    });
  });
});

