const db = require("../db/connection");

exports.fetchArticleById = (id) => {
  if (!/\d+/.test(id)) {
    return Promise.reject({ status: 400, msg: "invalid article_id" });
  }
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comments.article_id) AS comment_count FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id=$1
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

exports.fetchArticles = (sort_by = "created_at", order_by = "DESC", topic) => {
  if (
    !["title", "topic", "created_at", "author", "votes", "article_id"].includes(
      sort_by
    ) ||
    !["ASC", "DESC"].includes(order_by)
  ) {
    return Promise.reject({ status: 400, msg: "invalid query value" });
  }
  let key = [];

  let qryString = `SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_id, COUNT(comments.article_id) AS comment_count 
  FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `;

  if (topic) {
    key.push(topic);
    qryString += `
    WHERE articles.topic = $1 `;
  }
  qryString += `
  GROUP BY articles.article_id ORDER BY ${sort_by} ${order_by}`;

  return db.query(qryString, key).then(({ rows }) => {
    if (rows.length === 0 && topic) {
      return Promise.reject({ status: 400, msg: "invalid query value" });
    }
    return rows;
  });
};
