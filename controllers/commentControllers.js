const {
  fetchArticleComments,
  deleteComment,
  fetchComment
} = require("../models/commentModels");

exports.getArticleComments = (req, res, next) => {
  const id = req.params.article_id;

  fetchArticleComments(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.removeComment = (req, res, next) => {
  const id = req.params.comment_id;
  fetchComment(id)
    .then(() => {
      return deleteComment(id);
    })
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
};
