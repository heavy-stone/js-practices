import { test } from "node:test";
import assert from "node:assert/strict";

import { prepare_fizzbuzz_results, output_fizzbuzz } from "../fizzbuzz.js";

test("prepare_fizzbuzz_results", () => {
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
  ];
  assert.deepEqual(prepare_fizzbuzz_results(20), expected);
});

test("output_fizzbuzz", () => {
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
    output += message + "\n";
  };

  output_fizzbuzz(20);
  output = output.trim();
  console.log = original_console_log;

  assert.strictEqual(output, expected);
});
