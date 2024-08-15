#!/usr/bin/env node

import { fileURLToPath } from "url";
import process from "process";
import sqlite3 from "sqlite3";

import { dbRunPromise, dbGetPromise, dbClosePromise } from "./promiseFunc.js";

export default function promiseFuncWithError(callback) {
  const db = new sqlite3.Database(":memory:");

  dbRunPromise(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
  )
    .then(() => {
      return dbRunPromise(db, "INSERT INTO books(title) VALUES (?)", null);
    })
    .then(
      (_this) => {
        console.log(_this.lastID);
        return _this.lastID;
      },
      (err) => {
        console.log(err);
      },
    )
    .then((lastID) => {
      return dbGetPromise(
        db,
        "SELECT id, title FROM no_table_name WHERE id = ?",
        lastID,
      );
    })
    .then(
      (row) => {
        console.log(row);
      },
      (err) => {
        console.log(err);
      },
    )
    .then(() => {
      return dbRunPromise(db, "DROP TABLE books");
    })
    .then(() => {
      return dbClosePromise(db);
    })
    .then(() => {
      if (callback) callback();
    });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  promiseFuncWithError();
}
