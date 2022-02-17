const { addComment } = require("../models/commentModels");

exports.postComment = (req, res, next) => {
  const { username, body } = req.body;
  const articleId = req.params.article_id;

  addComment(username, body, articleId)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch(console.log);
};
