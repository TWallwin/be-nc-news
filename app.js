const express = require("express");
const {
  invalidPathError,
  handleCustomErrors,
  handlePSQLErrors,
  handle500s
} = require("./controllers/errorControllers");
const bodyParser = require("body-parser");
const {
  getArticleById,
  patchArticle,
  getArticles
} = require("./controllers/articleControllers");

const {
  getArticleComments,
  postComment
} = require("./controllers/commentControllers");

const { getUsers } = require("./controllers/userControllers");
const { getTopics } = require("./controllers/topicControllers");

const app = express();

app.use(bodyParser.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleComments);

app.patch("/api/articles/:article_id", patchArticle);

app.post("/api/articles/:article_id/comments", postComment);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handle500s);

app.all(`/*`, invalidPathError);
module.exports = app;
