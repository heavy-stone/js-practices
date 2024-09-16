import { beforeEach, afterEach, test } from "node:test";
import assert from "assert";

import { createDb } from "../../lib/dbModules.js";

let db;

function returnDbPromise(method, ...args) {
  return new Promise((resolve, reject) => {
    method.call(db, ...args, (err, ...results) => {
      if (err) reject(err);
      else resolve(...results);
    });
  });
}

beforeEach(async () => {
  db = createDb();

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

// https://www.sqlite.org/pragma.html#pragma_database_list
test("use in-memory database", async () => {
  const row = await returnDbPromise(db.get, "PRAGMA database_list");

  assert.strictEqual(row.name, "main");
  assert.strictEqual(row.file, ""); // インメモリデータベースの場合は空文字列（データベースファイル指定の場合はファイルパス）
});
