const { Router } = require("express");
const { getAllArticles, getArticleById, updateArticleById, createArticle, deleteArticle } = require("../controllers/articlesController");
const { protect } = require("../middleware/authMiddleware");

const articleRouter = Router()
const protectedArticleRouter = Router()

articleRouter.get("/articles", getAllArticles)
articleRouter.get("/articles/:article_id", getArticleById)
articleRouter.patch("/articles/:article_id", updateArticleById)
protectedArticleRouter.post("/articles", protect, createArticle)
protectedArticleRouter.delete("/articles/:article_id", protect, deleteArticle)

module.exports = {articleRouter, protectedArticleRouter}
