#!/usr/bin/env node

import { fileURLToPath } from "url";
import process from "process";

import { createDb } from "./lib/dbModules.js";

export default function confirmCallbackOperation(db = createDb()) {
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
    () => {
      db.run("INSERT INTO books(title) VALUES (?)", "Book 1", function () {
        console.log(this.lastID);

        db.get(
          "SELECT id, title FROM books WHERE id = ?",
          this.lastID,
          (_, row) => {
            console.log(row);

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
  confirmCallbackOperation();
}
