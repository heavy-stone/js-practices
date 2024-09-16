#!/usr/bin/env node

import { fileURLToPath } from "url";
import process from "process";
import sqlite3 from "sqlite3";

import { createDb } from "./lib/dbModules.js";
import {
  dbRunPromise,
  dbGetPromise,
  dbClosePromise,
} from "./lib/dbPromises.js";

export default async function confirmAsyncAwaitOperationWithError(
  db = createDb(),
) {
  await dbRunPromise(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
  );

  let stmt = null;
  try {
    stmt = await dbRunPromise(db, "INSERT INTO books(title) VALUES (?)", null);
    console.log(stmt.lastID);
  } catch (err) {
    if (
      err &&
      err.errno === sqlite3.CONSTRAINT &&
      err.code === "SQLITE_CONSTRAINT"
    ) {
      console.error(`Expected error in db.run(): ${err.message}`);
    } else {
      throw err;
    }
  }

  try {
    const row = await dbGetPromise(
      db,
      "SELECT id, title FROM no_table_name WHERE id = ?",
      stmt ? stmt.lastID : null,
    );
    console.log(row);
  } catch (err) {
    if (err && err.errno === sqlite3.ERROR && err.code === "SQLITE_ERROR") {
      console.error(`Expected error in db.get(): ${err.message}`);
    } else {
      throw err;
    }
  }

  await dbRunPromise(db, "DROP TABLE books");

  await dbClosePromise(db);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  confirmAsyncAwaitOperationWithError();
}
