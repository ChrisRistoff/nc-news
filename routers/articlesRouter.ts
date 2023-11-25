import { Router } from "express"
import { getAllArticles, getArticleById, updateArticleById, createArticle, deleteArticle, editArticleBody } from "../controllers/articlesController"
import { protect } from "../middleware/authMiddleware"

export const articleRouter = Router()
export const protectedArticleRouter = Router()

articleRouter.get("/articles", getAllArticles)
articleRouter.get("/articles/:article_id", getArticleById)
articleRouter.patch("/articles/:article_id", updateArticleById)
protectedArticleRouter.post("/articles", protect, createArticle)
protectedArticleRouter.delete("/articles/:article_id", protect, deleteArticle)
protectedArticleRouter.patch("/edit/articles/:article_id", protect, editArticleBody)
