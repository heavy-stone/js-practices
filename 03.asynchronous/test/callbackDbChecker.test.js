import { before, test } from "node:test";
import assert from "node:assert/strict";

import callbackDbChecker from "../callbackDbChecker.js";

let originalConsoleLog;

before(() => {
  originalConsoleLog = console.log;
});

function afterTest() {
  console.log = originalConsoleLog;
}

test("callback", (t, done) => {
  const expected = ["1", { id: 1, title: "Book 1" }].join("\n");

  let stdoutLines = [];
  console.log = (stdoutLine) => {
    stdoutLines.push(stdoutLine);
  };

  // https://nodejs.org/api/test.html#test-runner:~:text=test(%27callback%20passing%20test%27%2C%20(t%2C%20done)%20%3D%3E%20%7B
  // done(): 非同期処理が完了した時点でdoneを呼び出すことで、テストフレームワークに対してテストが終了したことを通知する
  // done(error): 非同期処理中にエラーが発生した場合、doneにエラーオブジェクトを渡すことで、テストフレームワークにエラーが発生したことを通知する
  callbackDbChecker(() => {
    const stdout = stdoutLines.join("\n");
    try {
      assert.strictEqual(stdout, expected);
      done();
    } catch (error) {
      done(error);
    } finally {
      afterTest();
    }
  });
});
