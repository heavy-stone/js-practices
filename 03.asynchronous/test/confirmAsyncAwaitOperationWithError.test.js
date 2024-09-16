import { beforeEach, afterEach, test } from "node:test";
import assert from "node:assert/strict";
import sinon from "sinon";

import confirmAsyncAwaitOperationWithError from "../confirmAsyncAwaitOperationWithError.js";
import { createDb } from "../lib/dbModules.js";

let originalConsoleLog;
let stderrLines = [];

beforeEach(() => {
  originalConsoleLog = console.error;
  console.error = (stderrLine) => {
    stderrLines.push(stderrLine);
  };
});

afterEach(() => {
  console.error = originalConsoleLog;
  stderrLines = [];
});

test("async await with expected error", async () => {
  const expected = [
    "Expected error in db.run(): SQLITE_CONSTRAINT: NOT NULL constraint failed: books.title",
    "Expected error in db.get(): SQLITE_ERROR: no such table: no_table_name",
  ].join("\n");

  await confirmAsyncAwaitOperationWithError();

  const stderr = stderrLines.join("\n");

  assert.strictEqual(stderr, expected);
});

test("async await with unexpected error in db.run()", async () => {
  const db = createDb();
  const dbRunStub = sinon.stub(db, "run");
  dbRunStub.onCall(0).callsFake((sql, params, callback) => {
    return db.run(sql, params, callback);
  });
  dbRunStub
    .onCall(1)
    .callsArgWith(2, new Error("Unexpected error in db.run()"));

  try {
    await confirmAsyncAwaitOperationWithError(db);

    assert.fail("Unexpected error wasn't thrown");
  } catch (err) {
    assert.strictEqual(err.message, "Unexpected error in db.run()");
  }

  const stderr = stderrLines.join("\n");

  assert.strictEqual(stderr, "");

  sinon.restore();
});

test("async await with unexpected error in db.get()", async () => {
  const expected =
    "Expected error in db.run(): SQLITE_CONSTRAINT: NOT NULL constraint failed: books.title";

  const db = createDb();
  const dbGetStub = sinon.stub(db, "get");
  dbGetStub
    .onCall(0)
    .callsArgWith(2, new Error("Unexpected error in db.get()"), null);

  try {
    await confirmAsyncAwaitOperationWithError(db);

    assert.fail("Unexpected error wasn't thrown");
  } catch (err) {
    assert.strictEqual(err.message, "Unexpected error in db.get()");
  }

  const stderr = stderrLines.join("\n");

  assert.strictEqual(stderr, expected);

  sinon.restore();
});
