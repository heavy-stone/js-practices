#!/usr/bin/env node

import { fileURLToPath } from "url";
import process from "process";
import sqlite3 from "sqlite3";

export default function promiseDbChecker(callback) {
  const db = new sqlite3.Database(":memory:");

  dbRunPromise(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
  )
    .then(() => {
      return dbRunPromise(db, "INSERT INTO books(title) VALUES (?)", "Book 1");
    })
    .then((_this) => {
      console.log(_this.lastID);
      return _this.lastID;
    })
    .then((lastID) => {
      return dbGetPromise(
        db,
        "SELECT id, title FROM books WHERE id = ?",
        lastID,
      );
    })
    .then((row) => {
      console.log(row);

      return dbRunPromise(db, "DROP TABLE books");
    })
    .then(() => {
      return dbClosePromise(db);
    })
    .then(() => {
      if (callback) callback();
    });
}

export function dbRunPromise(db, sql, ...params) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

export function dbGetPromise(db, sql, ...params) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

export function dbClosePromise(db) {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  promiseDbChecker();
}
