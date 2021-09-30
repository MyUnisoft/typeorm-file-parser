/* eslint-disable @typescript-eslint/no-namespace */

// Import Internal Dependencies
import * as Lexer from "../../src/decorator/lexer";
import * as utils from "../../src/utils";

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeIterableValue(expected: { token: symbol, raw: string }): R;
      toBeEOS(): R;
    }
  }
}

expect.extend({
  toBeIterableValue(received: IterableIterator<Lexer.TokenizerResult>, expected: Lexer.TokenizerResult) {
    const item = utils.getNextItem(received);
    if (item === utils.END_OF_SEQUENCE) {
      return {
        message: () => "expected a 'TokenizerResult' value but got an 'End Of Sequence' instead.",
        pass: false
      };
    }

    return {
      message: () => `expected the 'TokenizerResult' value to match: ${String(expected.token)}, ${expected.raw}`,
      pass: item.token === expected.token && item.raw === expected.raw
    };
  },
  toBeEOS(received: IterableIterator<Lexer.TokenizerResult>) {
    const item = utils.getNextItem(received);

    return {
      message: () => "expected 'End Of Sequence' for the received iterable.",
      pass: item === utils.END_OF_SEQUENCE
    };
  }
});

export default undefined;
