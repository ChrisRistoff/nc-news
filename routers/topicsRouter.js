const { Router } = require("express");
const { getAllTopics } = require("../controllers/topicsController");

const topicRouter = Router()

topicRouter.get("/topics", getAllTopics);

module.exports = topicRouter;
