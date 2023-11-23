const { Router } = require("express");
const { createCommentForArticle, getAllCommentsForArticle, deleteCommentById, updateCommentById } = require("../controllers/commentsController");
const { protect } = require("../middleware/authMiddleware");


const commentsRouter = Router()
const protectedCommentsRouter = Router()

commentsRouter.get("/articles/:article_id/comments", getAllCommentsForArticle)
commentsRouter.patch("/comments/:comment_id", updateCommentById)
protectedCommentsRouter.post("/articles/:article_id/comments", protect, createCommentForArticle)
protectedCommentsRouter.delete("/comments/:comment_id", protect, deleteCommentById)

module.exports = {commentsRouter, protectedCommentsRouter}
