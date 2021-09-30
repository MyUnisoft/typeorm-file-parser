// Import Third-party Dependencies
import is from "@slimio/is";
import { snakeCase } from "snake-case";

// Import Internal Dependencies
import { ParsingCodes, ParsingError } from "../src/decorator/errors";

describe("ParsingCodes", () => {
  it("should be a frozen Object", () => {
    expect(Object.isFrozen(ParsingCodes)).toBeTruthy();
  });

  it("should contains string value", () => {
    for (const message of Object.values(ParsingCodes)) {
      expect(typeof message).toStrictEqual("string");
    }
  });

  it("should contains only UPPER and SNAKE case keys", () => {
    for (const key of Object.keys(ParsingCodes)) {
      expect(key).toStrictEqual(snakeCase(key).toUpperCase());
    }
  });
});

describe("ParsingError", () => {
  it("should be a class", () => {
    expect(is.classObject(ParsingError)).toBeTruthy();
  });

  it("should create an Error of a given code and assign the right message", () => {
    const error = new ParsingError("EOS");

    expect(error.code).toStrictEqual("EOS");
    expect(error.message).toStrictEqual(ParsingCodes.EOS);
    expect(error.name).toStrictEqual("ParsingError");
  });

  it("should create an Error with a custom message (appended at the end of the original message)", () => {
    const customMessage = ", foobar";
    const error = new ParsingError("EOS", customMessage);

    expect(error.message).toStrictEqual(ParsingCodes.EOS + customMessage);
  });
});

