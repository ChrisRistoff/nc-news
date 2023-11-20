const express = require("express");
const { getAllTopics } = require("./controllers/topicsController");
const { getArticleById } = require("./controllers/articlesController");
const { sqlErrors, customErrors, serverError } = require("./middleware/errorHandlers");
const { getDocs } = require("./documentation/docController");
const { getAllCommentsForArticle } = require("./controllers/commentsController");

const app = express();


app.use(express.json());

//docs
app.get("/api", getDocs)

//topics
app.get("/api/topics", getAllTopics);

//articles
app.get("/api/articles/:article_id", getArticleById)

//comments
app.get("/api/articles/:article_id/comments", getAllCommentsForArticle)

app.use(sqlErrors, customErrors, serverError)
module.exports = app;
