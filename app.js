const express = require("express");
const topicRouter = require("./routers/topicsRouter");
const articleRouter = require("./routers/articlesRouter");
const commentsRouter = require("./routers/commentsRouter");
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
app.use("/api", articleRouter)

//comments
app.use("/api", commentsRouter)

//users
app.use("/api", usersRouter)

app.use(sqlErrors, customErrors, serverError)
module.exports = app;
