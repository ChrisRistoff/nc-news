const express = require("express");
const { getAllTopics } = require("./controllers/topicsController");
const { getArticleById } = require("./controllers/articlesController");
const { sqlErrors, customErrors } = require("./middleware/errorHandlers");
const app = express();

app.use(express.json());

//topics
app.get("/api/topics", getAllTopics);

//articles
app.get("/api/articles/:article_id", getArticleById)

app.use(sqlErrors, customErrors)
module.exports = app;
