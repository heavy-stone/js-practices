#!/usr/bin/env node

import { fileURLToPath } from "url";
import process from "process";

export function prepare() {
  const results = [];
  for (let i = 1; i <= 20; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      results.push("FizzBuzz");
    } else if (i % 3 === 0) {
      results.push("Fizz");
    } else if (i % 5 === 0) {
      results.push("Buzz");
    } else {
      results.push(i.toString());
    }
  }
  return results;
}

function exec() {
  const results = prepare();
  results.forEach((result) => {
    console.log(result);
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  exec();
}
