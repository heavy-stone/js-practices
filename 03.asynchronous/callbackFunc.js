#!/usr/bin/env node

import { fileURLToPath } from "url";
import process from "process";
import sqlite3 from "sqlite3";

export default function callbackFunc(callback) {
  const db = new sqlite3.Database(":memory:");

  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
    () => {
      const stmt = db.prepare("INSERT INTO books(title) VALUES (?)");
      const total = 2;

      for (let i = 1; i <= total; i++) {
        const title = `Book ${i}`;
        stmt.run(title, () => {
          console.log(`INSERT: id=${i} title=${title}`);

          if (i === total) {
            stmt.finalize(() => {
              db.all("SELECT id, title FROM books", (_, rows) => {
                rows.forEach((row) => {
                  console.log(`SELECT: id=${row.id} title=${row.title}`);
                });

                db.run("DROP TABLE books", () => {
                  db.close(() => {
                    if (callback) callback();
                  });
                });
              });
            });
          }
        });
      }
    },
  );
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  callbackFunc();
}
