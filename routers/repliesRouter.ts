import { Router } from "express";
import { createReply, deleteReplyById, editReplyBody, getAllRepliesForComment } from "../controllers/repliesController";
import { protect } from "../middleware/authMiddleware";

export const repliesRouter = Router()
export const protectedRepliesRouter = Router()

repliesRouter.get("/comments/:comment_id/replies", getAllRepliesForComment)

protectedRepliesRouter.post("/comments/:comment_id/replies", protect, createReply)
protectedRepliesRouter.delete("/replies/:reply_id", protect, deleteReplyById)
protectedRepliesRouter.patch("/replies/:reply_id", protect, editReplyBody)
