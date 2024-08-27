import sqlite3 from "sqlite3";

export function createDb() {
  return new sqlite3.Database(":memory:");
}
