const express = require("express");
const {
  invalidPathError,
  serverError
} = require("./controllers/errorControllers");
const bodyParser = require("body-parser");

const {
  getArticleById,
  patchArticle
} = require("./controllers/articleControllers");

const { getTopics } = require("./controllers/topicControllers");

const app = express();

app.use(bodyParser.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticle);

app.use(serverError); //catch all error controller
app.all(`/*`, invalidPathError);
module.exports = app;
