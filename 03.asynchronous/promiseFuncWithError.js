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

export default function promiseFuncWithError(callback) {
  const db = new sqlite3.Database(":memory:");

  dbRunPromise(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
  )
    .then(() => {
      return dbPreparePromise(db, "INSERT INTO books(title) VALUES (?)");
    })
    .then((stmt) => {
      const promises = [];
      for (let i = 1; i <= 2; i++) {
        const title = `Duplicate Book`;
        promises.push(
          stmtRunPromise(stmt, title).then(
            () => {
              console.log(`INSERT: id=${i} title=${title}`);
            },
            (err) => {
              console.log(err.message);
            },
          ),
        );
      }
      return Promise.all(promises).then(() => stmt);
    })
    .then((stmt) => stmtFinalizePromise(stmt))
    .then(() => dbAllPromise(db, "SELECT id, title FROM no_table_name"))
    .then(
      (rows) => {
        rows.forEach((row) => {
          console.log(`SELECT: id=${row.id} title=${row.title}`);
        });
      },
      (err) => {
        console.log(err.message);
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
