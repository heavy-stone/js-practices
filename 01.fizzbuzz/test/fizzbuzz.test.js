import { test } from "node:test";
import assert from "node:assert/strict";

import { outputFizzBuzz } from "../fizzbuzz.js";

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

  const original_console_log = console.log;
  let output = "";

  console.log = (message) => {
    output += output ? "\n" + message : message;
  };

  outputFizzBuzz(20);
  console.log = original_console_log;

  assert.strictEqual(output, expected);
});
