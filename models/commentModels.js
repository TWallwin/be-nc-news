const db = require("../db/connection");

exports.fetchArticleComments = (id) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [id])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 404, msg: "data not found" });
      }
      return rows;
    });
};
