#!/usr/bin/env node

import { fileURLToPath } from "url";
import process from "process";

export function outputFizzBuzz(maxNum) {
  const nums = [...Array(maxNum).keys()].map((i) => i + 1);

  nums.map((num) => {
    if (num % 3 === 0 && num % 5 === 0) {
      console.log("FizzBuzz");
    } else if (num % 3 === 0) {
      console.log("Fizz");
    } else if (num % 5 === 0) {
      console.log("Buzz");
    } else {
      console.log(num.toString());
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  outputFizzBuzz(20);
}
