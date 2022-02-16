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
  const incObj = req.body;
  fetchArticleById(id)
    .then(() => {
      return updateArticle(id, incObj);
    })
    // updateArticle(id, incObj)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
