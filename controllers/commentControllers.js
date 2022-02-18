const { fetchArticleById } = require("../models/articleModels");
const { addComment, fetchArticleComments } = require("../models/commentModels");
const { fetchUsernames } = require("../models/userModels");

exports.postComment = (req, res, next) => {
  const { username, body } = req.body;
  const articleId = req.params.article_id;

  if (!username | !body) {
    return next({ status: 400, msg: "comment added invalid form" });
  }
  fetchUsernames()
    .then((usernames) => {
      if (
        usernames.every((user) => {
          return user.username !== username;
        })
      ) {
        return Promise.reject({ status: 404, msg: "username does not exist" });
      }
      return fetchArticleById(articleId);
    })
    .then(() => {
      return addComment(username, body, articleId);
    })
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      return next(err);
    });
};

exports.getArticleComments = (req, res, next) => {
  const id = req.params.article_id;
  fetchArticleById(id)
    .then(() => {
      return fetchArticleComments(id);
    })
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
