#!/usr/bin/env node

import { fileURLToPath } from "url";
import process from "process";
import sqlite3 from "sqlite3";

export default function promiseFunc(callback) {
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
        const title = `Book ${i}`;
        promises.push(
          stmtRunPromise(stmt, title).then(() => {
            console.log(`INSERT: id=${i} title=${title}`);
          }),
        );
      }
      return Promise.all(promises).then(() => stmt);
    })
    .then((stmt) => {
      return stmtFinalizePromise(stmt);
    })
    .then(() => dbAllPromise(db, "SELECT id, title FROM books"))
    .then((rows) => {
      rows.forEach((row) => {
        console.log(`SELECT: id=${row.id} title=${row.title}`);
      });
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
    db.run(sql, params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function dbPreparePromise(db, sql, ...params) {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare(sql, params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(stmt);
      }
    });
  });
}

export function dbAllPromise(db, sql, ...params) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
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

export function stmtRunPromise(stmt, ...params) {
  return new Promise((resolve, reject) => {
    stmt.run(params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

export function stmtFinalizePromise(stmt) {
  return new Promise((resolve, reject) => {
    stmt.finalize((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  promiseFunc();
}
