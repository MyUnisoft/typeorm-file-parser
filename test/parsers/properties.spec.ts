// Import Internal Dependencies
import { parseDecoratorProperties, PROPERTIES_CONVERTOR } from "../../src/decorator/parsers/Properties";
import * as Lexer from "../../src/decorator/lexer";

import "../helpers/custom-matcher";

describe("PROPERTIES_CONVERTOR", () => {
  it("should convert properties as boolean", () => {
    expect(PROPERTIES_CONVERTOR.nullable("true")).toStrictEqual(true);
    expect(PROPERTIES_CONVERTOR.cascade("true")).toStrictEqual(true);
    expect(PROPERTIES_CONVERTOR.array("true")).toStrictEqual(true);
    expect(PROPERTIES_CONVERTOR.unique("true")).toStrictEqual(true);
    expect(PROPERTIES_CONVERTOR.insert("true")).toStrictEqual(true);
    expect(PROPERTIES_CONVERTOR.select("true")).toStrictEqual(true);
    expect(PROPERTIES_CONVERTOR.primary("true")).toStrictEqual(true);
  });

  it("should convert properties as string", () => {
    expect(PROPERTIES_CONVERTOR.onDelete("foo")).toStrictEqual("foo");
    expect(PROPERTIES_CONVERTOR.onUpdate("foo")).toStrictEqual("foo");
    expect(PROPERTIES_CONVERTOR.charset("foo")).toStrictEqual("foo");
    expect(PROPERTIES_CONVERTOR.comment("foo")).toStrictEqual("foo");
    expect(PROPERTIES_CONVERTOR.referencedColumnName("foo")).toStrictEqual("foo");
  });
});

describe("parseDecoratorProperties", () => {
  it("should return an empty Object", () => {
    const iter = Lexer.tokenize("{}");

    const received = parseDecoratorProperties(iter);
    expect(iter).toBeEOS();

    expect(Object.keys(received).length).toStrictEqual(0);
    expect(received).toMatchObject({});
  });

  it("should return an empty Object because 'foo' key is not known", () => {
    const iter = Lexer.tokenize("{ foo: \"bar\" }");

    const received = parseDecoratorProperties(iter);
    expect(iter).toBeEOS();

    expect(Object.keys(received).length).toStrictEqual(0);
    expect(received).toMatchObject({});
  });

  it("should parse and convert properties values", () => {
    // eslint-disable-next-line max-len
    const iter = Lexer.tokenize("{ type: \"varchar\", length: \"10\", width: \"10\", precision: \"10\", scale: 5, nullable: \"true\" }");

    const received = parseDecoratorProperties(iter);
    expect(iter).toBeEOS();

    expect(received).toMatchObject({
      type: "varchar",
      length: 10,
      width: 10,
      precision: 10,
      scale: 5,
      nullable: true
    });
  });
});

