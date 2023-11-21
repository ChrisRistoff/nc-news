const express = require("express");
const { getAllTopics } = require("./controllers/topicsController");
const { getArticleById, updateArticleById } = require("./controllers/articlesController");
const { sqlErrors, customErrors, serverError } = require("./middleware/errorHandlers");
const { getDocs } = require("./documentation/docController");
const { getAllArticles } = require("./controllers/articlesController");
const { getAllCommentsForArticle, createCommentForArticle, deleteCommentById } = require("./controllers/commentsController");
const { getAllUsers } = require("./controllers/usersController");

const app = express();

app.use(express.json())

//docs
app.get("/api", getDocs)

//topics
app.get("/api/topics", getAllTopics);

//articles
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles", getAllArticles)
app.patch("/api/articles/:article_id", updateArticleById)

//comments
app.post("/api/articles/:article_id/comments", createCommentForArticle)
app.get("/api/articles/:article_id/comments", getAllCommentsForArticle)
app.delete("/api/comments/:comment_id", deleteCommentById)

//users
app.get("/api/users", getAllUsers)

app.use(sqlErrors, customErrors, serverError)

module.exports = app;
