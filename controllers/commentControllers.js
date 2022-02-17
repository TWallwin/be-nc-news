const { fetchArticleComments } = require("../models/commentModels");

exports.getArticleComments = (req, res, next) => {
  const id = req.params.article_id;

  fetchArticleComments(id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
