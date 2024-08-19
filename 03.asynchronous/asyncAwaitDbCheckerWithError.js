#!/usr/bin/env node

import { fileURLToPath } from "url";
import process from "process";
import sqlite3 from "sqlite3";

import {
  dbRunPromise,
  dbGetPromise,
  dbClosePromise,
} from "./lib/dbPromises.js";

export default async function asyncAwaitDbCheckerWithError() {
  const db = new sqlite3.Database(":memory:");

  await dbRunPromise(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
  );

  let lastID = null;
  try {
    const stmt = await dbRunPromise(
      db,
      "INSERT INTO books(title) VALUES (?)",
      null,
    );
    console.log(stmt.lastID);
    lastID = stmt.lastID;
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT") {
      console.error(err.message);
    } else {
      throw err;
    }
  }

  try {
    const row = await dbGetPromise(
      db,
      "SELECT id, title FROM no_table_name WHERE id = ?",
      lastID,
    );
    console.log(row);
  } catch (err) {
    if (err.code === "SQLITE_ERROR") {
      console.error(err.message);
    } else {
      throw err;
    }
  }

  await dbRunPromise(db, "DROP TABLE books");

  await dbClosePromise(db);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  asyncAwaitDbCheckerWithError();
}
