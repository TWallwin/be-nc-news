const { fetchTopics, fetchArticleById } = require("../models/topicModels");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const id = req.params.article_id;

  fetchArticleById(id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};
