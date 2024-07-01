#!/usr/bin/env node

import { fileURLToPath } from "url";
import process from "process";

export function prepare_fizzbuzz_results(max_num) {
  const results = [...Array(max_num).keys()].map((i) => {
    const num = i + 1;
    if (num % 3 === 0 && num % 5 === 0) {
      return "FizzBuzz";
    } else if (num % 3 === 0) {
      return "Fizz";
    } else if (num % 5 === 0) {
      return "Buzz";
    } else {
      return num.toString();
    }
  });

  return results;
}

export function output_fizzbuzz(max_num) {
  const results = prepare_fizzbuzz_results(max_num);
  results.forEach((result) => {
    console.log(result);
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  output_fizzbuzz(20);
}
