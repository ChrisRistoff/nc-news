const express = require("express");
const topicRouter = require("./routers/topicsRouter");
const articles = require("./routers/articlesRouter");
const comments = require("./routers/commentsRouter");
const usersRouter = require("./routers/usersRouter");
const { sqlErrors, customErrors, serverError } = require("./middleware/errorHandlers");
const { getDocs } = require("./documentation/docController");

const app = express();

app.use(express.json())

//docs
app.get("/api", getDocs)

//topics
app.use("/api", topicRouter)

//articles
app.use("/api", articles.articleRouter)
app.use("/api", articles.protectedArticleRouter)

//comments
app.use("/api", comments.commentsRouter)
app.use("/api", comments.protectedCommentsRouter)

//users
app.use("/api", usersRouter)

app.use(sqlErrors, customErrors, serverError)
module.exports = app;
