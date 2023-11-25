import express from "express"
import * as topic from "./routers/topicsRouter"
import * as articles from "./routers/articlesRouter"
import * as comments from "./routers/commentsRouter"
import { usersRouter } from "./routers/usersRouter"
import { sqlErrors, customErrors, serverError } from "./middleware/errorHandlers"
import { getDocs } from "./documentation/docController"

export const app = express();

app.use(express.json())

//docs
app.get("/api", getDocs)

//topics
app.use("/api", topic.topicRouter)
app.use("/api", topic.protectedTopicRouter)

//articles
app.use("/api", articles.articleRouter)
app.use("/api", articles.protectedArticleRouter)

//comments
app.use("/api", comments.commentsRouter)
app.use("/api", comments.protectedCommentsRouter)

//users
app.use("/api", usersRouter)

app.use(sqlErrors, customErrors, serverError)
