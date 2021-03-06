const {
  fetchArticleById,
  checkArticleExists
} = require("../models/articleModels");
const {
  addComment,
  fetchArticleComments,
  deleteComment,
  checkCommentExists
} = require("../models/commentModels");

const { checkUsername } = require("../models/userModels");

exports.postComment = (req, res, next) => {
  const { username, body } = req.body;
  const articleId = req.params.article_id;

  Promise.all([checkUsername(username), checkArticleExists(articleId)])
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

exports.removeComment = (req, res, next) => {
  const id = req.params.comment_id;
  checkCommentExists(id)
    .then(() => {
      return deleteComment(id);
    })
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      return next(err);
    });
};
