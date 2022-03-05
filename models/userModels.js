const db = require("../db/connection");

exports.fetchUsernames = () => {
  return db.query("SELECT username FROM users;").then(({ rows }) => {
    return rows;
  });
};

exports.checkUsername = (username) => {
  if (!username) {
    return Promise.reject({ status: 400, msg: "comment added invalid form" });
  }

  return db
    .query("SELECT username FROM users;")
    .then(({ rows }) => {
      return rows;
    })
    .then((usernames) => {
      if (
        usernames.every((user) => {
          return user.username !== username;
        })
      ) {
        return Promise.reject({ status: 404, msg: "username does not exist" });
      }
    });
};
