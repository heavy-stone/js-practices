#!/usr/bin/env node

import { fileURLToPath } from "url";
import process from "process";
import parseArgs from "minimist";

export function execCalendar(options) {
  const isValidOptions = validateOptions(options);
  if (!isValidOptions) return;

  outputCalendar(options);
}

function validateOptions(options) {
  const YEAR_RANGE = { start: 1970, end: 2100 };
  const MONTH_RANGE = { start: 1, end: 12 };

  const year = options.y;
  const month = options.m;

  if (year !== undefined) {
    if (month === undefined) {
      console.log(
        "cal: this feature is not implemented. use -y option with -m option",
      );
      return false;
    }
    if (year < YEAR_RANGE.start || year > YEAR_RANGE.end) {
      console.log(
        `cal: year ${year} not in range ${YEAR_RANGE.start}..${YEAR_RANGE.end}`,
      );
      return false;
    }
  }

  if (
    month !== undefined &&
    (month < MONTH_RANGE.start || month > MONTH_RANGE.end)
  ) {
    console.log(
      `cal: ${month} is neither a month number (${MONTH_RANGE.start}..${MONTH_RANGE.end}) nor a name`,
    );
    return false;
  }

  return true;
}

function outputCalendar(options) {
  const DAY_DIGIT = 2; // 日付の表示桁数
  const SATURDAY_INDEX = 6;

  const today = new Date();
  const year = options.y === undefined ? today.getFullYear() : options.y;
  const month = options.m === undefined ? today.getMonth() + 1 : options.m;
  const monthFirstDate = new Date(year, month - 1, 1);
  const monthLastDate = new Date(year, month, 0);
  const monthDates = [];
  for (
    let date = new Date(monthFirstDate);
    date <= monthLastDate;
    date.setDate(date.getDate() + 1)
  ) {
    monthDates.push(new Date(date));
  }

  const header = formatToHeader(monthFirstDate);
  const weekLabel = "日 月 火 水 木 金 土";
  const spacesBeforeMonthFirstDate = "   ".repeat(monthFirstDate.getDay());
  const daysString = monthDates
    .map((date) => {
      let dayString = date.getDate().toString();
      dayString = dayString.padStart(DAY_DIGIT, " ");
      if (date.getDay() === SATURDAY_INDEX) {
        if (date.getDate() !== monthLastDate.getDate()) {
          dayString += "\n";
        }
      } else {
        dayString += " ";
      }
      return dayString;
    })
    .join("");
  const calendarDays = spacesBeforeMonthFirstDate + daysString;
  const calendar = [header, weekLabel, calendarDays].join("\n").concat("\n");
  console.log(calendar);
}

function formatToHeader(date) {
  const CALENDAR_WIDTH = 20;

  const localeDateString = date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
  });
  const [year, month] = localeDateString.split("年");
  const headerString = `${month} ${year}`;
  const paddingLeft = Math.floor((CALENDAR_WIDTH - headerString.length) / 2);
  return " ".repeat(paddingLeft) + headerString;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const options = parseArgs(process.argv.slice(2));
  execCalendar(options);
}