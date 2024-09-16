export async function dbRunPromise(db, sql, ...params) {
  let callback;
  if (params.length > 0 && typeof params[params.length - 1] === "function") {
    callback = params.pop();
  }
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (callback) {
        callback(err);
      }
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

export async function dbGetPromise(db, sql, ...params) {
  let callback;
  if (params.length > 0 && typeof params[params.length - 1] === "function") {
    callback = params.pop();
  }
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (callback) {
        callback(err, row);
      }
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}

export async function dbClosePromise(db, callback = null) {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (callback && typeof callback === "function") {
        callback(err);
      }
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
