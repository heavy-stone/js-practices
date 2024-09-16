#!/usr/bin/env node

import { fileURLToPath } from "url";
import process from "process";
import sqlite3 from "sqlite3";

import { createDb } from "./lib/dbModules.js";

export default function confirmCallbackOperationWithError(db = createDb()) {
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
    () => {
      db.run("INSERT INTO books(title) VALUES (?)", null, function (err) {
        if (err) {
          if (
            "errno" in err &&
            err.errno === sqlite3.CONSTRAINT &&
            "code" in err &&
            err.code === "SQLITE_CONSTRAINT"
          ) {
            console.error(`Expected error in db.run(): ${err.message}`);
          } else if (err instanceof Error) {
            console.error(`Unexpected error in db.run(): ${err.message}`);
          }
        } else {
          console.log(this.lastID);
        }

        db.get(
          "SELECT id, title FROM no_table_name WHERE id = ?",
          this ? this.lastID : null,
          (err, row) => {
            if (err) {
              if (
                "errno" in err &&
                err.errno === sqlite3.ERROR &&
                "code" in err &&
                err.code === "SQLITE_ERROR"
              ) {
                console.error(`Expected error in db.get(): ${err.message}`);
              } else if (err instanceof Error) {
                console.error(`Unexpected error in db.get(): ${err.message}`);
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
  confirmCallbackOperationWithError();
}
