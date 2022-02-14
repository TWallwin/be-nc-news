const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = (id) => {
  if (!/\d+/.test(id)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id=${id};`)
    .then(({ rows }) => {
      return rows;
    });
};
