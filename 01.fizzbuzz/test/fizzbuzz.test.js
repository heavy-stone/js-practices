import { before, after, test } from "node:test";
import assert from "node:assert/strict";

import { outputFizzBuzz } from "../fizzbuzz.js";

let originalConsoleLog;

before(() => {
  originalConsoleLog = console.log;
});

after(() => {
  console.log = originalConsoleLog;
});

test("outputFizzBuzz", () => {
  const expected = [
    "1",
    "2",
    "Fizz",
    "4",
    "Buzz",
    "Fizz",
    "7",
    "8",
    "Fizz",
    "Buzz",
    "11",
    "Fizz",
    "13",
    "14",
    "FizzBuzz",
    "16",
    "17",
    "Fizz",
    "19",
    "Buzz",
  ].join("\n");

  let stdoutLines = [];
  console.log = (stdoutLine) => {
    stdoutLines.push(stdoutLine);
  };
  outputFizzBuzz(20);
  const stdoutResult = stdoutLines.join("\n");

  assert.strictEqual(stdoutResult, expected);
});
