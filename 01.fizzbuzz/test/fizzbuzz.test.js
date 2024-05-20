import { test } from "node:test";
import assert from "node:assert/strict";

import { prepare } from "../fizzbuzz.js";

test("fizzbuzz", () => {
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
  assert.deepEqual(prepare(), expected);
});
