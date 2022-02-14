const express = require("express");
const {
  invalidPathError,
  serverError
} = require("./controllers/errorControllers");

const { getTopics, getArticleById } = require("./controllers/topicControllers");
const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.use(serverError); //catch all error controller
app.all(`/*`, invalidPathError);
module.exports = app;
