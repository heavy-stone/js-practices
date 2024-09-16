import { beforeEach, afterEach, test } from "node:test";
import sqlite3 from "sqlite3";
import assert from "assert";

import {
  dbRunPromise,
  dbGetPromise,
  dbClosePromise,
} from "../../lib/dbPromises.js";

let db;

// テスト用にsqlite3のメソッドは簡易なPromise化をして使用する。dbRunPromise, dbGetPromise, dbClosePromiseはテスト対象のため使用しない
function returnDbPromise(method, ...args) {
  return new Promise((resolve, reject) => {
    method.call(db, ...args, (err, ...results) => {
      if (err) reject(err);
      else resolve(...results);
    });
  });
}

beforeEach(async () => {
  db = new sqlite3.Database(":memory:");

  await returnDbPromise(
    db.run,
    "CREATE TABLE books (id INTEGER PRIMARY KEY, title TEXT NOT NULL UNIQUE)",
  );
});

afterEach(async () => {
  try {
    await returnDbPromise(db.run, "DROP TABLE books");

    await returnDbPromise(db.close);
  } catch (err) {
    if (err.message !== "SQLITE_MISUSE: Database is closed") {
      throw err;
    }
  }
});

test("dbRunPromise", async () => {
  await dbRunPromise(db, "INSERT INTO books (title) VALUES (?)", "Book 1");

  const row = await returnDbPromise(db.get, "SELECT * FROM books WHERE id = 1");

  assert.strictEqual(row.id, 1);
  assert.strictEqual(row.title, "Book 1");
});

test("dbRunPromise with callback", async () => {
  let callbackCalled = false;
  const callback = (err) => {
    callbackCalled = true;

    assert.strictEqual(err, null);
  };
  await dbRunPromise(
    db,
    "INSERT INTO books (title) VALUES (?)",
    "Book 1",
    callback,
  );

  assert.strictEqual(callbackCalled, true);
});

test("dbRunPromise with error", async () => {
  await dbRunPromise(db, "INSERT INTO books (title) VALUES (?)", "Book 1");

  try {
    await dbRunPromise(db, "INSERT INTO books (title) VALUES (?)", "Book 1");
  } catch (err) {
    assert.strictEqual(err.errno, 19);
    assert.strictEqual(err.code, "SQLITE_CONSTRAINT");
    assert.strictEqual(
      err.message,
      "SQLITE_CONSTRAINT: UNIQUE constraint failed: books.title",
    );
  }
});

test("dbGetPromise", async () => {
  await returnDbPromise(
    db.run,
    "INSERT INTO books (title) VALUES (?)",
    "Book 1",
  );

  const row = await dbGetPromise(
    db,
    "SELECT * FROM books WHERE title = ?",
    "Book 1",
  );

  assert.strictEqual(row.title, "Book 1");
});

test("dbGetPromise with callback", async () => {
  await returnDbPromise(
    db.run,
    "INSERT INTO books (title) VALUES (?)",
    "Book 1",
  );

  let callbackCalled = false;
  const callback = (err, row) => {
    callbackCalled = true;

    assert.strictEqual(err, null);
    assert.strictEqual(row.id, 1);
    assert.strictEqual(row.title, "Book 1");
  };
  await dbGetPromise(
    db,
    "SELECT * FROM books WHERE title = ?",
    "Book 1",
    callback,
  );

  assert.strictEqual(callbackCalled, true);
});

test("dbGetPromise with error", async () => {
  await returnDbPromise(
    db.run,
    "INSERT INTO books (title) VALUES (?)",
    "Book 1",
  );

  try {
    await dbGetPromise(db, "SELECT * FROM no_table_name");
  } catch (err) {
    assert.strictEqual(err.errno, 1);
    assert.strictEqual(err.code, "SQLITE_ERROR");
    assert.strictEqual(
      err.message,
      "SQLITE_ERROR: no such table: no_table_name",
    );
  }
});

// db接続を判断するメソッドがなく、dbが閉じたことはdb操作を試してエラーが発生するかで確認できるため、通常のdbClosePromiseのテストはdbClosePromise with callbackとdbClosePromise with errorのテストに含まれるものとする
test("dbClosePromise with callback", async () => {
  let callbackCalled = false;
  const callback = (err) => {
    callbackCalled = true;

    assert.strictEqual(err, null);
  };

  await dbClosePromise(db, callback);

  assert.strictEqual(callbackCalled, true);
});

test("dbClosePromise with error", async () => {
  await dbClosePromise(db);

  try {
    await dbClosePromise(db);
  } catch (err) {
    assert.strictEqual(err.errno, 21);
    assert.strictEqual(err.code, "SQLITE_MISUSE");
    assert.strictEqual(err.message, "SQLITE_MISUSE: Database is closed");
  }
});
