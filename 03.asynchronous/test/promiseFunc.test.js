import { before, test } from "node:test";
import assert from "node:assert/strict";

import promiseFunc from "../promiseFunc.js";

let originalConsoleLog;

before(() => {
  originalConsoleLog = console.log;
});

function afterTest() {
  console.log = originalConsoleLog;
}

test("promise", (t, done) => {
  const expected = ["1", { id: 1, title: "Book 1" }].join("\n");

  let stdoutLines = [];
  console.log = (stdoutLine) => {
    stdoutLines.push(stdoutLine);
  };

  promiseFunc(() => {
    const stdout = stdoutLines.join("\n");
    try {
      assert.strictEqual(stdout, expected);
      done();
    } catch (error) {
      done(error);
    } finally {
      afterTest();
    }
  });
});
