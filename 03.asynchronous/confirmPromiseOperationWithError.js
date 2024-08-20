#!/usr/bin/env node

import { fileURLToPath } from "url";
import process from "process";
import sqlite3 from "sqlite3";

import {
  dbRunPromise,
  dbGetPromise,
  dbClosePromise,
} from "./lib/dbPromises.js";

export default function confirmPromiseOperationWithError() {
  const db = new sqlite3.Database(":memory:");

  dbRunPromise(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
  )
    .then(() => dbRunPromise(db, "INSERT INTO books(title) VALUES (?)", null))
    .catch((err) => {
      if (err) {
        if (err.code === "SQLITE_CONSTRAINT") {
          console.error(err.message);
        } else {
          throw err;
        }
      }
    })
    .then((stmt) => {
      const lastID = stmt ? stmt.lastID : null;
      return dbGetPromise(
        db,
        "SELECT id, title FROM no_table_name WHERE id = ?",
        lastID,
      );
    })
    .catch((err) => {
      if (err.code === "SQLITE_ERROR") {
        console.error(err.message);
      } else {
        throw err;
      }
    })
    .then((row) => {
      if (row) console.log(row);

      return dbRunPromise(db, "DROP TABLE books");
    })
    .then(() => dbClosePromise(db));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  confirmPromiseOperationWithError();
}
