const { Router } = require("express");
const { getAllArticles, getArticleById, updateArticleById, createArticle, deleteArticle, editArticleBody } = require("../controllers/articlesController");
const { protect } = require("../middleware/authMiddleware");

const articleRouter = Router()
const protectedArticleRouter = Router()

articleRouter.get("/articles", getAllArticles)
articleRouter.get("/articles/:article_id", getArticleById)
articleRouter.patch("/articles/:article_id", updateArticleById)
protectedArticleRouter.post("/articles", protect, createArticle)
protectedArticleRouter.delete("/articles/:article_id", protect, deleteArticle)
protectedArticleRouter.patch("/edit/articles/:article_id", protect, editArticleBody)

module.exports = {articleRouter, protectedArticleRouter}
