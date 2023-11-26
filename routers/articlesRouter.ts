import { Router } from "express";
import {
  getAllArticles,
  getArticleById,
  updateArticleById,
  createArticle,
  deleteArticle,
  editArticleBody,
} from "../controllers/articlesController";
import { protect } from "../middleware/authMiddleware";

export const articleRouter = Router();
export const protectedArticleRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       properties:
 *         author:
 *           type: string
 *         title:
 *           type: string
 *         article_id:
 *           type: integer
 *         topic:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         votes:
 *           type: integer
 *         article_img_url:
 *           type: string
 *           format: uri
 *         comment_count:
 *           type: integer
 */


/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Retrieves a list of articles
 *     description: Provides a list of all articles, with the option to filter by topic, order, sort by certain fields, and paginate results.
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: topic
 *         schema:
 *           type: string
 *         required: false
 *         description: Topic to filter the articles
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         required: false
 *         description: Order of the articles (ascending or descending)
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [title, topic, author, created_at, votes, comment_count, article_id]
 *         required: false
 *         description: Field to sort the articles by
 *       - in: query
 *         name: p
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of articles to return per page
 *     responses:
 *       200:
 *         description: A list of articles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 articles:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *                 total_count:
 *                   type: integer
 *                   description: Total number of articles
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Topic not found
 */
articleRouter.get("/articles", getAllArticles);

/**
 * @swagger
 * /api/articles/{article_id}:
 *   get:
 *     summary: Retrieves a specific article by ID
 *     description: Provides detailed information about a specific article identified by its unique ID.
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: article_id
 *         required: true
 *         description: Unique ID of the article
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detailed information about the article
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 article:
 *                   $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article ID not found
 */
articleRouter.get("/articles/:article_id", getArticleById);

/**
 * @swagger
 * /api/articles/{article_id}:
 *   patch:
 *     summary: Updates the vote count of an article
 *     description: Increments or decrements the vote count of a specific article by the provided value.
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: article_id
 *         required: true
 *         description: Unique ID of the article to be updated
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               inc_votes:
 *                 type: number
 *                 description: The number of votes to increment or decrement
 *     responses:
 *       200:
 *         description: The updated article
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newArticle:
 *                   $ref: '#/components/schemas/Article'
 *       400:
 *         description: Invalid input for increment votes
 *       404:
 *         description: Article ID not found
 */
articleRouter.patch("/articles/:article_id", updateArticleById);

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Creates a new article
 *     description: Allows authenticated users to create a new article.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - body
 *               - topic
 *             properties:
 *               title:
 *                 type: string
 *               body:
 *                 type: string
 *               topic:
 *                 type: string
 *               article_img_url:
 *                 type: string
 *                 format: uri
 *                 description: Optional URL of the article image
 *     responses:
 *       201:
 *         description: The article was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 article:
 *                   $ref: '#/components/schemas/Article'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Topic not found
 *       401:
 *         description: You need to be logged in
 */
protectedArticleRouter.post("/articles", protect, createArticle);

/**
 * @swagger
 * /api/articles/{article_id}:
 *   delete:
 *     summary: Deletes a specific article
 *     description: Allows an authenticated user to delete their own article. Users cannot delete articles created by others.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: article_id
 *         required: true
 *         description: Unique ID of the article to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: The article was successfully deleted
 *       401:
 *         description: Unauthorized - Article belongs to another user or You need to be logged in
 *       404:
 *         description: Article ID not found
 */
protectedArticleRouter.delete("/articles/:article_id", protect, deleteArticle);

/**
 * @swagger
 * /api/articles/body/{article_id}:
 *   patch:
 *     summary: Updates the body of a specific article
 *     description: Allows an authenticated user to update the body of their own article. Users cannot update articles created by others.
 *     tags: [Articles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: article_id
 *         required: true
 *         description: Unique ID of the article to be updated
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: string
 *                 description: The new body content for the article
 *     responses:
 *       200:
 *         description: The article was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 article:
 *                   $ref: '#/components/schemas/Article'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized - Article belongs to another user or You need to be logged on
 *       404:
 *         description: Article ID not found
 */
protectedArticleRouter.patch(
  "/edit/articles/:article_id",
  protect,
  editArticleBody,
);
