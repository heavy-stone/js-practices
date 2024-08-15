import { before, test } from "node:test";
import assert from "node:assert/strict";

import asyncAwaitFunc from "../asyncAwaitFunc.js";

let originalConsoleLog;

before(() => {
  originalConsoleLog = console.log;
});

function afterTest() {
  console.log = originalConsoleLog;
}

test("async await", (t, done) => {
  const expected = [
    "INSERT: id=1 title=Book 1",
    "INSERT: id=2 title=Book 2",
    "SELECT: id=1 title=Book 1",
    "SELECT: id=2 title=Book 2",
  ].join("\n");

  let stdoutLines = [];
  console.log = (stdoutLine) => {
    stdoutLines.push(stdoutLine);
  };

  asyncAwaitFunc(() => {
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
