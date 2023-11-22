const { Router } = require("express");
const { getAllTopics, createTopic } = require("../controllers/topicsController");

const topicRouter = Router()

topicRouter.get("/topics", getAllTopics);
topicRouter.post("/topics", createTopic)

module.exports = topicRouter;
