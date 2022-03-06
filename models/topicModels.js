const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.checkTopicExists = (topic) => {
  if (!topic) return;
  return db
    .query(`SELECT * FROM topics WHERE slug=$1;`, [topic])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 400, msg: "invalid query value" });
      }
    });
};
