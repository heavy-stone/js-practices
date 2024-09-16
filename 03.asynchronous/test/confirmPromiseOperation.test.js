import { beforeEach, afterEach, test } from "node:test";
import assert from "node:assert/strict";

import confirmPromiseOperation from "../confirmPromiseOperation.js";

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

test("promise", async () => {
  const expected = ["1", { id: 1, title: "Book 1" }].join("\n");

  await confirmPromiseOperation();

  const stdout = stdoutLines.join("\n");

  assert.strictEqual(stdout, expected);
});
