#!/usr/bin/env node

import { fileURLToPath } from "url";
import process from "process";
import sqlite3 from "sqlite3";

export default function callbackFuncWithError(callback) {
  const db = new sqlite3.Database(":memory:");

  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
    () => {
      db.run("INSERT INTO books(title) VALUES (?)", null, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log(this.lastID);
        }

        db.get(
          "SELECT id, title FROM no_table_name WHERE id = ?",
          this.lastID,
          (err, row) => {
            if (err) {
              console.log(err);
            } else {
              console.log(row);
            }

            db.run("DROP TABLE books", () => {
              db.close(() => {
                if (callback) callback();
              });
            });
          },
        );
      });
    },
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  callbackFuncWithError();
}
