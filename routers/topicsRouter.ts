import { Router } from "express";
import {
  getAllTopics,
  createTopic,
  getActiveUsersInTopic,
} from "../controllers/topicsController";
import { protect } from "../middleware/authMiddleware";

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

export const topicRouter = Router();
export const protectedTopicRouter = Router();

/**
 * @swagger
 * /api/topics:
 *   get:
 *     summary: Retrieves all topics
 *     description: Provides a list of all available topics, along with the count of articles in each topic.
 *     tags: [Topics]
 *     responses:
 *       200:
 *         description: A list of topics with article counts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 topics:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Topic'
 *                       - type: object
 *                         properties:
 *                           article_count:
 *                             type: integer
 *                             description: Count of articles in the topic
 *                             example: 14
 */
topicRouter.get("/topics", getAllTopics);

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
topicRouter.get("/topics/:topic/users", getActiveUsersInTopic);

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
protectedTopicRouter.post("/topics", protect, createTopic);
