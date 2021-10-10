// Import Node.js Dependencies
import path from "path";

// Import Third-party Dependencies
import is from "@slimio/is";

// Import Internal Dependencies
import { readFile } from "../src/index";

// CONSTANTS
const kFixturesPath = path.join(__dirname, "fixtures");

describe("readFile", () => {
  it("should be able to read GiArticle", async() => {
    const result = await readFile(path.join(kFixturesPath, "GiArticle.ts"));

    expect(is.plainObject(result)).toStrictEqual(true);
    expect("properties" in result).toStrictEqual(true);
    expect("unique" in result).toStrictEqual(true);

    expect(result.unique).toMatchObject({
      constraintName: "GiArticle_reference",
      columns: ["reference"]
    });

    expect(result).toMatchSnapshot();
  });

  it("should be able to read Empty", async() => {
    const result = await readFile(path.join(kFixturesPath, "Empty.ts"));

    expect("unique" in result).toStrictEqual(false);

    const id = result.properties.id;
    expect(id.type).toStrictEqual("number");
    expect("PrimaryColumn" in id.decorators).toStrictEqual(true);
  });
});

