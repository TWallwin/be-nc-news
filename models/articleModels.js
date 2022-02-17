const db = require("../db/connection");

exports.fetchArticleById = (id) => {
  if (!/\d+/.test(id)) {
    return Promise.reject({ status: 400, msg: "invalid article_id" });
  }
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(articles.article_id) AS comment_count FROM articles 
    RIGHT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id=$1
    GROUP BY articles.article_id;`,
      [id]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      return rows[0];
    });
};
exports.updateArticle = (id, incObj) => {
  if (Object.keys(incObj).join("") !== "inc_votes") {
    return Promise.reject({ status: 400, msg: "invalid input" });
  }
  if (!/\d+/.test(id)) {
    return Promise.reject({ status: 400, msg: "invalid article_id" });
  }
  inc = Number(incObj.inc_votes);
  return db
    .query(
      `UPDATE articles SET votes = votes+$1 WHERE article_id=$2 RETURNING *`,
      [inc, id]
    )
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      return rows[0];
    });
};
