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
exports.fetchComment = (id) => {
  if (!/\d+/.test(id)) {
    return Promise.reject({ status: 400, msg: "invalid comment_id" });
  }
  return db
    .query(`SELECT * FROM comments WHERE comment_id =$1`, [id])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({ status: 404, msg: "comment not found" });
      }
    });
};

exports.deleteComment = (id) => {
  return db.query(`DELETE FROM comments WHERE comment_id = $1;`, [id]);
};
