import { before, after, test } from "node:test";
import assert from "node:assert/strict";

import confirmCallbackOperationWithError from "../confirmCallbackOperationWithError.js";

let originalConsoleLog;

before(() => {
  originalConsoleLog = console.error;
});

after(() => {
  console.error = originalConsoleLog;
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

test("callback with error", async () => {
  const expected = [
    "SQLITE_CONSTRAINT: NOT NULL constraint failed: books.title",
    "SQLITE_ERROR: no such table: no_table_name",
  ].join("\n");

  let stderrLines = [];
  console.error = (stderrLine) => {
    stderrLines.push(stderrLine);
  };

  confirmCallbackOperationWithError();
  await sleep(10);

  const stderr = stderrLines.join("\n");

  assert.strictEqual(stderr, expected);
});
