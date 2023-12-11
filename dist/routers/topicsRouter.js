"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectedTopicRouter = exports.topicRouter = void 0;
const express_1 = require("express");
const topicsController_1 = require("../controllers/topicsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
/**
 * @swagger
 * components:
 *   schemas:
 *     Topic:
 *       type: object
 *       properties:
 *         creator:
 *           type: string
 *         slug:
 *           type: string
 *         description:
 *           type: string
 */
exports.topicRouter = (0, express_1.Router)();
exports.protectedTopicRouter = (0, express_1.Router)();
/**
 * @swagger
 * /api/topics:
 *   get:
 *     summary: Retrieves all topics
 *     description: Provides a list of all available topics.
 *     tags: [Topics]
 *     responses:
 *       200:
 *         description: A list of topics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 topics:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Topic'
 */
exports.topicRouter.get("/topics", topicsController_1.getAllTopics);
/**
 * @swagger
 * /api/topics/{topic}/users:
 *   get:
 *     summary: Retrieves active users in a specific topic
 *     description: Provides a list of users who have contributed articles to a specific topic.
 *     tags: [Topics]
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         description: The topic to search for active users
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of active users in the specified topic
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       404:
 *         description: Topic not found
 */
exports.topicRouter.get("/topics/:topic/users", topicsController_1.getActiveUsersInTopic);
/**
 * @swagger
 * /api/topics:
 *   post:
 *     summary: Creates a new topic
 *     description: Allows an authenticated user to create a new topic.
 *     tags: [Topics]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [slug, description]
 *             properties:
 *               slug:
 *                 type: string
 *                 description: Unique identifier for the topic
 *               description:
 *                 type: string
 *                 description: Description of the topic
 *     responses:
 *       201:
 *         description: New topic created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Topic'
 *       400:
 *         description: Invalid input
 */
exports.protectedTopicRouter.post("/topics", authMiddleware_1.protect, topicsController_1.createTopic);
