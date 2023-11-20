const express = require("express");
const { getAllTopics } = require("./controllers/topicsController");
const { getArticleById } = require("./controllers/articlesController");
const { sqlErrors, customErrors, serverError } = require("./middleware/errorHandlers");
const app = express();

//topics
app.get("/api/topics", getAllTopics);

//articles
app.get("/api/articles/:article_id", getArticleById)

app.use(sqlErrors, customErrors, serverError)
module.exports = app;
