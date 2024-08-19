#!/usr/bin/env node

import { fileURLToPath } from "url";
import process from "process";
import sqlite3 from "sqlite3";

import {
  dbRunPromise,
  dbGetPromise,
  dbClosePromise,
} from "./promiseSQLite3Checker.js";

export default async function asyncAwaitDbCheckerWithError(callback) {
  const db = new sqlite3.Database(":memory:");

  await dbRunPromise(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
  );

  let lastID;
  try {
    const _this = await dbRunPromise(
      db,
      "INSERT INTO books(title) VALUES (?)",
      null,
    );
    console.log(_this.lastID);
    lastID = _this.lastID;
  } catch (err) {
    console.log(err);
    lastID = null;
  }

  try {
    const row = await dbGetPromise(
      db,
      "SELECT id, title FROM no_table_name WHERE id = ?",
      lastID,
    );
    console.log(row);
  } catch (err) {
    console.log(err);
  }

  await dbRunPromise(db, "DROP TABLE books");
  await dbClosePromise(db);
  if (callback) callback();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  asyncAwaitDbCheckerWithError();
}
