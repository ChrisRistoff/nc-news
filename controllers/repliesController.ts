import { Request, Response, NextFunction } from "express";
import { getRepliesForCommentModel } from "../models/repliesModel";

export const getAllRepliesForComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { comment_id } = req.params;

  try {
    const replies = await getRepliesForCommentModel(comment_id)

    res.status(200).send({ replies })
  } catch (error) {
    next(error)
  }
};
