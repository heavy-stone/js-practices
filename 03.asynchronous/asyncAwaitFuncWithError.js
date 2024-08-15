#!/usr/bin/env node

import { fileURLToPath } from "url";
import process from "process";
import sqlite3 from "sqlite3";

import {
  dbRunPromise,
  dbPreparePromise,
  dbAllPromise,
  dbClosePromise,
  stmtRunPromise,
  stmtFinalizePromise,
} from "./promiseFunc.js";

export default async function asyncAwaitFuncWithError(callback) {
  const db = new sqlite3.Database(":memory:");

  await dbRunPromise(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
  );

  const stmt = await dbPreparePromise(
    db,
    "INSERT INTO books(title) VALUES (?)",
  );

  const promises = [];
  for (let i = 1; i <= 2; i++) {
    const title = "Duplicate Book";
    try {
      promises.push(await stmtRunPromise(stmt, title));
      console.log(`INSERT: id=${i} title=${title}`);
    } catch (err) {
      console.log(err.message);
    }
  }
  await Promise.all(promises);
  await stmtFinalizePromise(stmt);

  try {
    const rows = await dbAllPromise(db, "SELECT id, title FROM no_table_name");
    rows.forEach((row) => {
      console.log(`SELECT: id=${row.id} title=${row.title}`);
    });
  } catch (err) {
    console.log(err.message);
  }

  await dbRunPromise(db, "DROP TABLE books");
  await dbClosePromise(db);
  if (callback) callback();
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  asyncAwaitFuncWithError();
}
