import { before, after, test } from "node:test";
import assert from "node:assert/strict";

import confirmPromiseOperation from "../confirmPromiseOperation.js";

let originalConsoleLog;

before(() => {
  originalConsoleLog = console.log;
});

after(() => {
  console.log = originalConsoleLog;
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

test("promise", async () => {
  const expected = ["1", { id: 1, title: "Book 1" }].join("\n");

  let stdoutLines = [];
  console.log = (stdoutLine) => {
    stdoutLines.push(stdoutLine);
  };

  confirmPromiseOperation();
  await sleep(10);

  const stdout = stdoutLines.join("\n");

  assert.strictEqual(stdout, expected);
});
