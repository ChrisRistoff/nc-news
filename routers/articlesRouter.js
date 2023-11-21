const { Router } = require("express");
const { getAllArticles, getArticleById, updateArticleById } = require("../controllers/articlesController");


const articleRouter = Router()

articleRouter.get("/articles", getAllArticles)
articleRouter.get("/articles/:article_id", getArticleById)
articleRouter.patch("/articles/:article_id", updateArticleById)

module.exports = articleRouter
