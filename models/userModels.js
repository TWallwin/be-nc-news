const db = require("../db/connection");

exports.fetchUsers = () => {
  return db.query("SELECT username FROM users;").then(({ rows }) => {
    return rows;
  });
};
