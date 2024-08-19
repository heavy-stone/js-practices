import { before, after, test } from "node:test";
import assert from "node:assert/strict";

import promiseDbCheckerWithError from "../promiseDbCheckerWithError.js";

let originalConsoleLog;

before(() => {
  originalConsoleLog = console.error;
});

after(() => {
  console.error = originalConsoleLog;
});

test("promise db checker with error", (t, done) => {
  const expected = [
    "SQLITE_CONSTRAINT: NOT NULL constraint failed: books.title",
    "SQLITE_ERROR: no such table: no_table_name",
  ].join("\n");

  let stdoutLines = [];
  console.error = (stdoutLine) => {
    stdoutLines.push(stdoutLine);
  };

  promiseDbCheckerWithError();

  setTimeout(() => {
    const stdout = stdoutLines.join("\n");

    assert.strictEqual(stdout, expected);
    done();
  }, 10);
});
