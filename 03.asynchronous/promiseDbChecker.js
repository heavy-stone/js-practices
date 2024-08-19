#!/usr/bin/env node

import { fileURLToPath } from "url";
import process from "process";
import sqlite3 from "sqlite3";

import {
  dbRunPromise,
  dbGetPromise,
  dbClosePromise,
} from "./lib/dbPromises.js";

export default function promiseDbChecker() {
  const db = new sqlite3.Database(":memory:");

  dbRunPromise(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
  )
    .then(() =>
      dbRunPromise(db, "INSERT INTO books(title) VALUES (?)", "Book 1"),
    )
    .then((stmt) => {
      console.log(stmt.lastID);

      return dbGetPromise(
        db,
        "SELECT id, title FROM books WHERE id = ?",
        stmt.lastID,
      );
    })
    .then((row) => {
      console.log(row);

      return dbRunPromise(db, "DROP TABLE books");
    })
    .then(() => dbClosePromise(db));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  promiseDbChecker();
}
