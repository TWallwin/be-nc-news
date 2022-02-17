const { addComment, fetchArticleComments } = require("../models/commentModels");

exports.postComment = (req, res, next) => {
  const { username, body } = req.body;
  const articleId = req.params.article_id;

  addComment(username, body, articleId)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(next);
};

exports.getArticleComments = (req, res, next) => {
  const id = req.params.article_id;

  fetchArticleComments(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
