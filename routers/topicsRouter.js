const { Router } = require("express");
const {
  getAllTopics,
  createTopic,
  getActiveUsersInTopic,
} = require("../controllers/topicsController");
const { protect } = require("../middleware/authMiddleware");

const topicRouter = Router();
const protectedTopicRouter = Router();

topicRouter.get("/topics", getAllTopics);
topicRouter.get("/topics/:topic/users", getActiveUsersInTopic);
protectedTopicRouter.post("/topics", protect, createTopic);

module.exports = { topicRouter, protectedTopicRouter };
