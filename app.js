const express = require("express");
const {
  invalidPathError,
  serverError
} = require("./controllers/errorControllers");
const { getTopics } = require("./controllers/topicControllers");
const app = express();

app.get("/api/topics", getTopics);

app.all(`/*`, invalidPathError);

app.use(serverError); //catch all error controller
module.exports = app;
