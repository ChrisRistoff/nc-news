"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedRepliesRouter = exports.repliesRouter = void 0;
const express_1 = require("express");
const repliesController_1 = require("../controllers/repliesController");
const authMiddleware_1 = require("../middleware/authMiddleware");
exports.repliesRouter = (0, express_1.Router)();
exports.protectedRepliesRouter = (0, express_1.Router)();
/**
 * @swagger
 * components:
 *   schemas:
 *     Reply:
 *       type: object
 *       properties:
 *         author:
 *           type: string
 *         comment_id:
 *           type: integer
 *         reply_id:
 *           type: integer
 *         created_at:
 *           type: string
 *           format: date-time
 *         votes:
 *           type: integer
 */
/**
 * @swagger
 * /api/comments/{comment_id}/replies:
 *   get:
 *     summary: Retrieves replies for a specific comment
 *     tags: [Replies]
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID to fetch replies for
 *     responses:
 *       200:
 *         description: A list of replies for the specified comment
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 replies:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Reply'
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     Reply:
 *       type: object
 *       properties:
 *         reply_id:
 *           type: string
 *           description: The ID of the reply
 *         comment_id:
 *           type: string
 *           description: The ID of the comment the reply is associated with
 */
exports.repliesRouter.get("/comments/:comment_id/replies", repliesController_1.getAllRepliesForComment);
/**
 * @swagger
 * /api/replies/{reply_id}/:
 *   patch:
 *     summary: Updates the vote count of a reply
 *     tags: [Replies]
 *     parameters:
 *       - in: path
 *         name: reply_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the reply to update the vote count
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - inc_votes
 *             properties:
 *               inc_votes:
 *                 type: integer
 *                 description: The increment or decrement value for the votes
 *     responses:
 *       200:
 *         description: Vote count updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reply:
 *                   $ref: '#/components/schemas/Reply'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Reply not found
 *       500:
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     Reply:
 *       type: object
 *       properties:
 *         reply_id:
 *           type: string
 *           description: The ID of the reply
 *         comment_id:
 *           type: string
 *           description: The ID of the comment the reply is associated with
 *         author:
 *           type: string
 *           description: The author of the reply
 *         body:
 *           type: string
 *           description: The body of the reply
 *         votes:
 *           type: integer
 *           description: The vote count of the reply
 */
exports.repliesRouter.patch("/replies/:reply_id", repliesController_1.updateReplyVote);
/**
 * @swagger
 * /api/comments/{comment_id}/replies:
 *   post:
 *     summary: Creates a reply to a specific comment
 *     tags: [Replies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: comment_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The comment ID to which the reply is posted
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - body
 *             properties:
 *               body:
 *                 type: string
 *                 description: The body of the reply
 *     responses:
 *       201:
 *         description: Reply created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reply:
 *                   $ref: '#/components/schemas/Reply'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     Reply:
 *       type: object
 *       properties:
 *         reply_id:
 *           type: string
 *           description: The ID of the reply
 *         comment_id:
 *           type: string
 *           description: The ID of the comment the reply is associated with
 *         author:
 *           type: string
 *           description: The author of the reply
 *         body:
 *           type: string
 *           description: The body of the reply
 */
exports.protectedRepliesRouter.post("/comments/:comment_id/replies", authMiddleware_1.protect, repliesController_1.createReply);
/**
 * @swagger
 * /api/replies/{reply_id}:
 *   delete:
 *     summary: Deletes a reply by ID
 *     tags: [Replies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reply_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the reply to delete
 *     responses:
 *       204:
 *         description: Reply deleted successfully
 *       401:
 *         description: Unauthorized, reply belongs to another user
 *       404:
 *         description: Reply not found
 *       500:
 *         description: Internal server error
 */
exports.protectedRepliesRouter.delete("/replies/:reply_id", authMiddleware_1.protect, repliesController_1.deleteReplyById);
/**
 * @swagger
 * /api/replies/{reply_id}/edit:
 *   patch:
 *     summary: Edits the body of a reply
 *     tags: [Replies]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reply_id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the reply to edit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - body
 *             properties:
 *               body:
 *                 type: string
 *                 description: The new body of the reply
 *     responses:
 *       200:
 *         description: Reply edited successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reply:
 *                   $ref: '#/components/schemas/Reply'
 *       401:
 *         description: Unauthorized, reply belongs to another user
 *       404:
 *         description: Reply not found
 *       500:
 *         description: Internal server error
 *
 * components:
 *   schemas:
 *     Reply:
 *       type: object
 *       properties:
 *         reply_id:
 *           type: string
 *           description: The ID of the reply
 *         comment_id:
 *           type: string
 *           description: The ID of the comment the reply is associated with
 *         author:
 *           type: string
 *           description: The author of the reply
 *         body:
 *           type: string
 *           description: The body of the reply
 */
exports.protectedRepliesRouter.patch("/replies/:reply_id/edit", authMiddleware_1.protect, repliesController_1.editReplyBody);
