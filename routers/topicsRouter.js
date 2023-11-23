const { Router } = require("express");
const {
  getAllTopics,
  createTopic,
} = require("../controllers/topicsController");
const { protect } = require("../middleware/authMiddleware");

const topicRouter = Router();
const protectedTopicRouter = Router();

topicRouter.get("/topics", getAllTopics);
protectedTopicRouter.post("/topics", protect, createTopic);

module.exports = { topicRouter, protectedTopicRouter };
