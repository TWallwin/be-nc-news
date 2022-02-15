const { fetchArticleById, updateArticle } = require("../models/articleModels");

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;
  fetchArticleById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticle = (req, res, next) => {
  const id = req.params.article_id;
  const inc = Number(req.body.inc_votes);
  fetchArticleById(id)
    .then(() => {
      return updateArticle(id, inc);
    })
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
