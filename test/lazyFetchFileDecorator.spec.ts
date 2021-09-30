// Import Node.js Dependencies
import path from "path";

// Import Internal Dependencies
import { lazyFetchFileDecorator } from "../src/index";

// CONSTANTS
const kFixturesPath = path.join(__dirname, "fixtures");

describe("lazyFetchFileDecorator", () => {
  it("should fetch all properties and decorators from GiArticle", async() => {
    const result: any[] = [];
    const asyncIter = await lazyFetchFileDecorator(path.join(kFixturesPath, "GiArticle.ts"));

    for await (const decorator of asyncIter) {
      result.push(decorator as any);
    }

    expect(result).toMatchSnapshot("GiArticleFixture");
  });
});

