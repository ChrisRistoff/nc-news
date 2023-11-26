import { Router } from "express";
import {
  createCommentForArticle,
  getAllCommentsForArticle,
  deleteCommentById,
  updateCommentById,
  editCommentById,
} from "../controllers/commentsController";
import { protect } from "../middleware/authMiddleware";

export const commentsRouter = Router();
export const protectedCommentsRouter = Router();

commentsRouter.get("/articles/:article_id/comments", getAllCommentsForArticle);
commentsRouter.patch("/comments/:comment_id", updateCommentById);
protectedCommentsRouter.post(
  "/articles/:article_id/comments",
  protect,
  createCommentForArticle,
);
protectedCommentsRouter.delete(
  "/comments/:comment_id",
  protect,
  deleteCommentById,
);
protectedCommentsRouter.patch(
  "/edit/comments/:comment_id",
  protect,
  editCommentById,
);
