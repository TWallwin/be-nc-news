const db = require("../db/connection");
const { convertTimestampToDate } = require("../db/helpers/utils");

exports.addComment = (username, body, articleId) => {
  const time = convertTimestampToDate({ created_at: Date.now() }).created_at;

  return db
    .query(
      `INSERT INTO comments (body, votes, author, created_at, article_id) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [body, 0, username, time, articleId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
