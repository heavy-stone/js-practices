#!/usr/bin/env node

import { fileURLToPath } from "url";
import process from "process";
import sqlite3 from "sqlite3";

import { dbRunPromise, dbGetPromise, dbClosePromise } from "./promiseFunc.js";

export default async function asyncAwaitFunc(callback) {
  const db = new sqlite3.Database(":memory:");

  await dbRunPromise(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
  );

  const _this = await dbRunPromise(
    db,
    "INSERT INTO books(title) VALUES (?)",
    "Book 1",
  );
  console.log(_this.lastID);

  const row = await dbGetPromise(
    db,
    "SELECT id, title FROM books WHERE id = ?",
    _this.lastID,
  );
  console.log(row);

  await dbRunPromise(db, "DROP TABLE books");
  await dbClosePromise(db);
  if (callback) callback();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  asyncAwaitFunc();
}
