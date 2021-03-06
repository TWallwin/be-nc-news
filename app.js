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
const { getEndpoints } = require("./controllers/endpointControllers");
const {
  getArticleComments,
  postComment,
  removeComment
} = require("./controllers/commentControllers");

const { getUsers } = require("./controllers/userControllers");
const { getTopics } = require("./controllers/topicControllers");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/users", getUsers);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.get("/api", getEndpoints);

app.patch("/api/articles/:article_id", patchArticle);

app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", removeComment);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handle500s);

app.all(`/*`, invalidPathError);
module.exports = app;
