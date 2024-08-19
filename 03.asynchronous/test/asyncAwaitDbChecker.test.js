import { before, after, test } from "node:test";
import assert from "node:assert/strict";

import asyncAwaitDbChecker from "../asyncAwaitDbChecker.js";

let originalConsoleLog;

before(() => {
  originalConsoleLog = console.log;
});

after(() => {
  console.log = originalConsoleLog;
});

test("async await db checker", (t, done) => {
  const expected = ["1", { id: 1, title: "Book 1" }].join("\n");

  let stdoutLines = [];
  console.log = (stdoutLine) => {
    stdoutLines.push(stdoutLine);
  };

  asyncAwaitDbChecker();

  setTimeout(() => {
    const stdout = stdoutLines.join("\n");

    assert.strictEqual(stdout, expected);
    done();
  }, 10);
});
