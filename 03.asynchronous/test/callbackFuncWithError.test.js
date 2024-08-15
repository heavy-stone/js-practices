import { before, test } from "node:test";
import assert from "node:assert/strict";

import callbackFuncWithError from "../callbackFuncWithError.js";

let originalConsoleLog;

before(() => {
  originalConsoleLog = console.log;
});

function afterTest() {
  console.log = originalConsoleLog;
}

test("callback with error", (t, done) => {
  const expected = [
    "Error: SQLITE_CONSTRAINT: NOT NULL constraint failed: books.title",
    "Error: SQLITE_ERROR: no such table: no_table_name",
  ].join("\n");

  let stdoutLines = [];
  console.log = (stdoutLine) => {
    stdoutLines.push(stdoutLine);
  };

  callbackFuncWithError(() => {
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
