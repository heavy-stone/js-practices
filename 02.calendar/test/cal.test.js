import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import sinon from "sinon";
import { execCalendar } from "../cal.js";

let originalConsoleLog;
const fixedDate = new Date(2024, 6, 26); // new Date()を2024年7月26日に固定
let clock;

before(() => {
  originalConsoleLog = console.log;
  clock = sinon.useFakeTimers(fixedDate);
});

after(() => {
  console.log = originalConsoleLog;
  clock.restore();
});

test("execCalendar with no options", () => {
  const expected =
    "      7月 2024\n" +
    "日 月 火 水 木 金 土\n" +
    "    1  2  3  4  5  6\n" +
    " 7  8  9 10 11 12 13\n" +
    "14 15 16 17 18 19 20\n" +
    "21 22 23 24 25 26 27\n" +
    "28 29 30 31 \n";

  let stdoutLines = [];
  console.log = (stdoutLine) => {
    stdoutLines.push(stdoutLine);
  };
  const today = new Date();
  execCalendar({ y: today.getFullYear(), m: today.getMonth() + 1 });
  const stdoutResult = stdoutLines.join("\n");

  assert.strictEqual(stdoutResult, expected);
});

test("execCalendar with -m option", () => {
  const expected =
    "      11月 2024\n" +
    "日 月 火 水 木 金 土\n" +
    "                1  2\n" +
    " 3  4  5  6  7  8  9\n" +
    "10 11 12 13 14 15 16\n" +
    "17 18 19 20 21 22 23\n" +
    "24 25 26 27 28 29 30\n";

  let stdoutLines = [];
  console.log = (stdoutLine) => {
    stdoutLines.push(stdoutLine);
  };
  execCalendar({ m: 11 });
  const stdoutResult = stdoutLines.join("\n");

  assert.strictEqual(stdoutResult, expected);
});

test("execCalendar with -y and -m option", () => {
  const expected =
    "      11月 2020\n" +
    "日 月 火 水 木 金 土\n" +
    " 1  2  3  4  5  6  7\n" +
    " 8  9 10 11 12 13 14\n" +
    "15 16 17 18 19 20 21\n" +
    "22 23 24 25 26 27 28\n" +
    "29 30 \n";

  let stdoutLines = [];
  console.log = (stdoutLine) => {
    stdoutLines.push(stdoutLine);
  };
  execCalendar({ y: 2020, m: 11 });
  const stdoutResult = stdoutLines.join("\n");

  assert.strictEqual(stdoutResult, expected);
});

test("execCalendar with -y option but no -m option", () => {
  const expected =
    "cal: this feature is not implemented. use -y option with -m option";

  let stdoutLines = [];
  console.log = (stdoutLine) => {
    stdoutLines.push(stdoutLine);
  };
  execCalendar({ y: 2020 });
  const stdoutResult = stdoutLines.join("\n");

  assert.strictEqual(stdoutResult, expected);
});

test("execCalendar with -y option but smaller than year range", () => {
  const expected = "cal: year 1969 not in range 1970..2100";

  let stdoutLines = [];
  console.log = (stdoutLine) => {
    stdoutLines.push(stdoutLine);
  };
  execCalendar({ y: 1969, m: 11 });
  const stdoutResult = stdoutLines.join("\n");

  assert.strictEqual(stdoutResult, expected);
});

test("execCalendar with -y option and equal to smallest year range", () => {
  const expected =
    "      11月 1970\n" +
    "日 月 火 水 木 金 土\n" +
    " 1  2  3  4  5  6  7\n" +
    " 8  9 10 11 12 13 14\n" +
    "15 16 17 18 19 20 21\n" +
    "22 23 24 25 26 27 28\n" +
    "29 30 \n";

  let stdoutLines = [];
  console.log = (stdoutLine) => {
    stdoutLines.push(stdoutLine);
  };
  execCalendar({ y: 1970, m: 11 });
  const stdoutResult = stdoutLines.join("\n");

  assert.strictEqual(stdoutResult, expected);
});

test("execCalendar with -y option and equal to largest year range", () => {
  const expected =
    "      11月 2100\n" +
    "日 月 火 水 木 金 土\n" +
    "    1  2  3  4  5  6\n" +
    " 7  8  9 10 11 12 13\n" +
    "14 15 16 17 18 19 20\n" +
    "21 22 23 24 25 26 27\n" +
    "28 29 30 \n";

  let stdoutLines = [];
  console.log = (stdoutLine) => {
    stdoutLines.push(stdoutLine);
  };
  execCalendar({ y: 2100, m: 11 });
  const stdoutResult = stdoutLines.join("\n");

  assert.strictEqual(stdoutResult, expected);
});

test("execCalendar with -y option but larger than year range", () => {
  const expected = "cal: year 2101 not in range 1970..2100";

  let stdoutLines = [];
  console.log = (stdoutLine) => {
    stdoutLines.push(stdoutLine);
  };
  execCalendar({ y: 2101, m: 11 });
  const stdoutResult = stdoutLines.join("\n");

  assert.strictEqual(stdoutResult, expected);
});

test("execCalendar with -m option but smaller than month range", () => {
  const expected = "cal: 0 is neither a month number (1..12) nor a name";

  let stdoutLines = [];
  console.log = (stdoutLine) => {
    stdoutLines.push(stdoutLine);
  };
  execCalendar({ m: 0 });
  const stdoutResult = stdoutLines.join("\n");

  assert.strictEqual(stdoutResult, expected);
});

test("execCalendar with -m option and equal to smallest month range", () => {
  const expected =
    "      1月 2024\n" +
    "日 月 火 水 木 金 土\n" +
    "    1  2  3  4  5  6\n" +
    " 7  8  9 10 11 12 13\n" +
    "14 15 16 17 18 19 20\n" +
    "21 22 23 24 25 26 27\n" +
    "28 29 30 31 \n";

  let stdoutLines = [];
  console.log = (stdoutLine) => {
    stdoutLines.push(stdoutLine);
  };
  execCalendar({ m: 1 });
  const stdoutResult = stdoutLines.join("\n");

  assert.strictEqual(stdoutResult, expected);
});

test("execCalendar with -m option and equal to largest month range", () => {
  const expected =
    "      12月 2024\n" +
    "日 月 火 水 木 金 土\n" +
    " 1  2  3  4  5  6  7\n" +
    " 8  9 10 11 12 13 14\n" +
    "15 16 17 18 19 20 21\n" +
    "22 23 24 25 26 27 28\n" +
    "29 30 31 \n";

  let stdoutLines = [];
  console.log = (stdoutLine) => {
    stdoutLines.push(stdoutLine);
  };
  execCalendar({ m: 12 });
  const stdoutResult = stdoutLines.join("\n");

  assert.strictEqual(stdoutResult, expected);
});

test("execCalendar with -m option but larger than month range", () => {
  const expected = "cal: 13 is neither a month number (1..12) nor a name";

  let stdoutLines = [];
  console.log = (stdoutLine) => {
    stdoutLines.push(stdoutLine);
  };
  execCalendar({ m: 13 });
  const stdoutResult = stdoutLines.join("\n");

  assert.strictEqual(stdoutResult, expected);
});
