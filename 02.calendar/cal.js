#!/usr/bin/env node

import { fileURLToPath } from "url";
import process from "process";
import parseArgs from "minimist";

export function execCalendar(options, today = new Date()) {
  const isValidOptions = validateOptions(options);
  if (!isValidOptions) return;

  outputCalendar(options, today);
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

function outputCalendar(options, today) {
  const DAY_DIGIT = 2;
  const SATURDAY_INDEX = 6;
  const WEEK_LABEL = "日 月 火 水 木 金 土";

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

  const header = formatHeader(monthFirstDate);
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
  const calendar = [header, WEEK_LABEL, calendarDays].join("\n").concat("\n");
  console.log(calendar);
}

function formatHeader(date) {
  const CALENDAR_WIDTH = 20;

  const headerString = `${date.getMonth() + 1}月 ${date.getFullYear()}`;
  const paddingLeft = Math.floor((CALENDAR_WIDTH - headerString.length) / 2);
  return " ".repeat(paddingLeft) + headerString;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const options = parseArgs(process.argv.slice(2));
  execCalendar(options);
}
