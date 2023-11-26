import { Router } from "express";
import {
  getAllTopics,
  createTopic,
  getActiveUsersInTopic,
} from "../controllers/topicsController";
import { protect } from "../middleware/authMiddleware";

export const topicRouter = Router();
export const protectedTopicRouter = Router();

topicRouter.get("/topics", getAllTopics);
topicRouter.get("/topics/:topic/users", getActiveUsersInTopic);
protectedTopicRouter.post("/topics", protect, createTopic);
