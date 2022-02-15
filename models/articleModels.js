const db = require("../db/connection");

exports.fetchArticleById = (id) => {
  if (!/\d+/.test(id)) {
    return Promise.reject({ status: 400, msg: "invalid article_id" });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id=${id};`)
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      return rows[0];
    });
};
exports.updateArticle = (id, inc) => {
  return db
    .query(
      `UPDATE articles SET votes = votes+${inc} WHERE article_id=${id} RETURNING *`
    )
    .then(({ rows }) => {
      return rows[0];
    });
};