import { Router } from "express";
import { getAllRepliesForComment } from "../controllers/repliesController";

export const repliesRouter = Router()

repliesRouter.get("/comments/:comment_id/replies", getAllRepliesForComment)
