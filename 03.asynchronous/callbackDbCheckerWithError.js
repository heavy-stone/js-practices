#!/usr/bin/env node

import { fileURLToPath } from "url";
import process from "process";
import sqlite3 from "sqlite3";

export default function callbackDbCheckerWithError() {
  const db = new sqlite3.Database(":memory:");

  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
    () => {
      db.run("INSERT INTO books(title) VALUES (?)", null, function (err) {
        if (err) {
          if (err.code === "SQLITE_CONSTRAINT") {
            console.error(err.message);
          } else {
            throw err;
          }
        } else {
          console.log(this.lastID);
        }

        db.get(
          "SELECT id, title FROM no_table_name WHERE id = ?",
          this.lastID,
          (err, row) => {
            if (err) {
              if (err.code === "SQLITE_ERROR") {
                console.error(err.message);
              } else {
                throw err;
              }
            } else {
              console.log(row);
            }

            db.run("DROP TABLE books", () => {
              db.close();
            });
          },
        );
      });
    },
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  callbackDbCheckerWithError();
}
