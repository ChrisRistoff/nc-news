const { Router } = require("express");
const { createCommentForArticle, getAllCommentsForArticle, deleteCommentById } = require("../controllers/commentsController");


const commentsRouter = Router()

commentsRouter.post("/articles/:article_id/comments", createCommentForArticle)
commentsRouter.get("/articles/:article_id/comments", getAllCommentsForArticle)
commentsRouter.delete("/comments/:comment_id", deleteCommentById)

module.exports = commentsRouter
