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
      if (article.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      res.status(200).send({ article });
    })
    .catch(next);
};
