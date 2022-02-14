const { fetchTopics } = require("../models/topicModels");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      console.log(topics);
      res.status(200).send({ topics });
    })
    .catch(next);
};
