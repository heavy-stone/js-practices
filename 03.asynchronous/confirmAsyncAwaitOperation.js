#!/usr/bin/env node

import { fileURLToPath } from "url";
import process from "process";

import { createDb } from "./lib/dbModules.js";
import {
  dbRunPromise,
  dbGetPromise,
  dbClosePromise,
} from "./lib/dbPromises.js";

export default async function confirmAsyncAwaitOperation() {
  const db = createDb();

  await dbRunPromise(
    db,
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
  );

  const stmt = await dbRunPromise(
    db,
    "INSERT INTO books(title) VALUES (?)",
    "Book 1",
  );
  console.log(stmt.lastID);

  const row = await dbGetPromise(
    db,
    "SELECT id, title FROM books WHERE id = ?",
    stmt.lastID,
  );
  console.log(row);

  await dbRunPromise(db, "DROP TABLE books");

  await dbClosePromise(db);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  confirmAsyncAwaitOperation();
}
