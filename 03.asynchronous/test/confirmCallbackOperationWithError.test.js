import { beforeEach, afterEach, test } from "node:test";
import assert from "node:assert/strict";
import sinon from "sinon";

import confirmCallbackOperationWithError from "../confirmCallbackOperationWithError.js";
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

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

test("callback with expected error", async () => {
  const expected = [
    "Expected error in db.run(): SQLITE_CONSTRAINT: NOT NULL constraint failed: books.title",
    "Expected error in db.get(): SQLITE_ERROR: no such table: no_table_name",
  ].join("\n");

  confirmCallbackOperationWithError();
  await sleep(10);

  const stderr = stderrLines.join("\n");

  assert.strictEqual(stderr, expected);
});

test("callback with unexpected error in db.run()", async () => {
  const expected = [
    "Unexpected error in db.run(): Unexpected error in db.run()",
    "Expected error in db.get(): SQLITE_ERROR: no such table: no_table_name",
  ].join("\n");

  const db = createDb();
  const dbRunStub = sinon.stub(db, "run");
  dbRunStub.onCall(0).callsArg(1);
  dbRunStub
    .onCall(1)
    .callsArgWith(2, new Error("Unexpected error in db.run()"));

  confirmCallbackOperationWithError(db);
  await sleep(10);

  const stderr = stderrLines.join("\n");

  assert.strictEqual(stderr, expected);

  sinon.restore();
});

test("callback with unexpected error in db.get()", async () => {
  const expected = [
    "Expected error in db.run(): SQLITE_CONSTRAINT: NOT NULL constraint failed: books.title",
    "Unexpected error in db.get(): Unexpected error in db.get()",
  ].join("\n");

  const db = createDb();
  const dbGetStub = sinon.stub(db, "get");
  dbGetStub
    .onCall(0)
    .callsArgWith(2, new Error("Unexpected error in db.get()"), null);

  confirmCallbackOperationWithError(db);
  await sleep(10);

  const stderr = stderrLines.join("\n");

  assert.strictEqual(stderr, expected);

  sinon.restore();
});
