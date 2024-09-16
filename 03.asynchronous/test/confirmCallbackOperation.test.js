import { beforeEach, afterEach, test } from "node:test";
import assert from "node:assert/strict";

import confirmCallbackOperation from "../confirmCallbackOperation.js";

let originalConsoleLog;
let stdoutLines = [];

beforeEach(() => {
  originalConsoleLog = console.log;
  console.log = (stdoutLine) => {
    stdoutLines.push(stdoutLine);
  };
});

afterEach(() => {
  console.log = originalConsoleLog;
  stdoutLines = [];
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

test("callback", async () => {
  const expected = ["1", { id: 1, title: "Book 1" }].join("\n");

  confirmCallbackOperation();
  await sleep(10);

  const stdout = stdoutLines.join("\n");

  assert.strictEqual(stdout, expected);
});
