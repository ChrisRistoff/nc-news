const { Router } = require("express");
const { createCommentForArticle, getAllCommentsForArticle, deleteCommentById, updateCommentById } = require("../controllers/commentsController");


const commentsRouter = Router()

commentsRouter.post("/articles/:article_id/comments", createCommentForArticle)
commentsRouter.get("/articles/:article_id/comments", getAllCommentsForArticle)
commentsRouter.delete("/comments/:comment_id", deleteCommentById)
commentsRouter.patch("/comments/:comment_id", updateCommentById)

module.exports = commentsRouter
