const { Router } = require("express");
const { getAllArticles, getArticleById, updateArticleById, createArticle } = require("../controllers/articlesController");


const articleRouter = Router()

articleRouter.get("/articles", getAllArticles)
articleRouter.get("/articles/:article_id", getArticleById)
articleRouter.patch("/articles/:article_id", updateArticleById)
articleRouter.post("/articles", createArticle)

module.exports = articleRouter
