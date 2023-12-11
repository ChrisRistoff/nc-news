"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedCommentsRouter = exports.commentsRouter = void 0;
const express_1 = require("express");
const commentsController_1 = require("../controllers/commentsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
exports.commentsRouter = (0, express_1.Router)();
exports.protectedCommentsRouter = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         author:
 *           type: string
 *         article_id:
 *           type: integer
 *         comment_id:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         votes:
 *           type: integer
 */
/**
 * @swagger
 * /api/articles/{article_id}/comments:
 *   get:
 *     summary: Retrieves all comments for a specific article
 *     description: Provides a list of all comments associated with a specific article. Supports pagination.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: article_id
 *         required: true
 *         description: Unique ID of the article for which comments are being retrieved
 *         schema:
 *           type: string
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
 *         description: Number of comments to return per page
 *     responses:
 *       200:
 *         description: A list of comments for the specified article
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comments:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Article ID not found
 */
exports.commentsRouter.get("/articles/:article_id/comments", commentsController_1.getAllCommentsForArticle);
/**
 * @swagger
 * /api/comments/{comment_id}:
 *   patch:
 *     summary: Updates the vote count of a specific comment
 *     description: Allows users to update the vote count of a comment by incrementing or decrementing it.
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         description: Unique ID of the comment to be updated
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
 *                 type: integer
 *                 description: The number of votes to increment or decrement the comment by
 *     responses:
 *       200:
 *         description: The vote count of the comment was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 newComment:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Comment ID not found
 */
exports.commentsRouter.patch("/comments/:comment_id", commentsController_1.updateCommentById);
/**
 * @swagger
 * /api/articles/{article_id}/comments:
 *   post:
 *     summary: Creates a new comment for a specific article
 *     description: Allows an authenticated user to add a comment to a specific article.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: article_id
 *         required: true
 *         description: Unique ID of the article to comment on
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
 *                 description: The content of the comment
 *     responses:
 *       201:
 *         description: The comment was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Body can not be empty
 *       404:
 *         description: Article ID not found
 *       401:
 *         description: You need to be logged in
 */
exports.protectedCommentsRouter.post("/articles/:article_id/comments", authMiddleware_1.protect, commentsController_1.createCommentForArticle);
/**
 * @swagger
 * /api/comments/{comment_id}:
 *   delete:
 *     summary: Deletes a specific comment
 *     description: Allows an authenticated user to delete their own comment. Users cannot delete comments made by others.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         description: Unique ID of the comment to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: The comment was successfully deleted
 *       401:
 *         description: Comment belongs to another user or You need to be logged in
 *       404:
 *         description: Comment does not exist
 */
exports.protectedCommentsRouter.delete("/comments/:comment_id", authMiddleware_1.protect, commentsController_1.deleteCommentById);
/**
 * @swagger
 * /api/comments/{comment_id}/edit:
 *   patch:
 *     summary: Edits a specific comment
 *     description: Allows an authenticated user to edit their own comment. Users cannot edit comments made by others.
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         description: Unique ID of the comment to be edited
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
 *                 description: The updated content of the comment
 *     responses:
 *       200:
 *         description: The comment was successfully edited
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 comment:
 *                   $ref: '#/components/schemas/Comment'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Comment belongs to another user or You need to be logged in
 *       404:
 *         description: Comment ID not found
 */
exports.protectedCommentsRouter.patch("/comments/:comment_id/edit", authMiddleware_1.protect, commentsController_1.editCommentById);
