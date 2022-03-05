const {
  fetchArticleById,
  updateArticle,
  fetchArticles
} = require("../models/articleModels");

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

  updateArticle(id, incObj)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  //destructure and prepare querys
  const sortBy = req.query.sort_by;
  let order = req.query.order;
  let topic = req.query.topic;
  if (order) {
    order = order.toUpperCase();
  }

  //pass query into model function
  fetchArticles(sortBy, order, topic, req)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
