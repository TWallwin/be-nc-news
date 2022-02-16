const db = require("../db/connection");

exports.fetchUsernames = () => {
  return db.query("SELECT username FROM users;").then(({ rows }) => {
    return rows;
  });
};
