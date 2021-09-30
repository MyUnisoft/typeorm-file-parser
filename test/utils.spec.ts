// Import Third-party Dependencies
import is from "@slimio/is";

// Import Internal Dependencies
import * as utils from "../src/utils";

describe("charSet", () => {
  it("should be a function", () => {
    expect(is.func(utils.charSet)).toBeTruthy();
  });

  it("should accept a list of string primitive and return them in an ECMAScript 6 Set Object", () => {
    const mySet = utils.charSet("1", "2", "3");

    expect(is.set(mySet)).toBeTruthy();
    expect([...mySet]).toMatchObject(["1", "2", "3"]);
  });

  it("should accept an ASCII range as number", () => {
    const mySet = utils.charSet([48, 57]);

    expect([...mySet]).toMatchObject(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]);
  });

  it("should accept a mix between ASCII range and string primitive", () => {
    const mySet = utils.charSet(
      [48, 57],
      "$", "_"
    );

    expect([...mySet]).toMatchObject(["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "$", "_"]);
  });

  it("should return an empty Set if no values is provided", () => {
    const mySet = utils.charSet();

    expect(mySet.size).toStrictEqual(0);
  });
});

describe("END_OF_SEQUENCE", () => {
  it("should be a symbol primitive", () => {
    expect(typeof utils.END_OF_SEQUENCE).toStrictEqual("symbol");
  });

  it("should be equal to 'Symbol(EOS)' when stringified", () => {
    expect(String(utils.END_OF_SEQUENCE)).toStrictEqual("Symbol(EOS)");
  });
});

describe("getNextItem", () => {
  it("should be a function", () => {
    expect(is.func(utils.getNextItem)).toBeTruthy();
  });

  it("should return END_OF_SEQUENCE symbol when an iterable is done", () => {
    function* emptyIter() {
      // DO Nothing
    }
    const iter = emptyIter();

    expect(utils.getNextItem(iter)).toStrictEqual(utils.END_OF_SEQUENCE);
  });

  it("should return iterable value when done is false", () => {
    function* customIter() {
      yield "foo";
    }
    const iter = customIter();

    expect(utils.getNextItem(iter)).toStrictEqual("foo");
    expect(utils.getNextItem(iter)).toStrictEqual(utils.END_OF_SEQUENCE);
  });
});
