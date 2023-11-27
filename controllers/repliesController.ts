import { Request, Response, NextFunction } from "express";
import {
  createReplyModel,
  getRepliesForCommentModel,
} from "../models/repliesModel";
import { CustomRequest } from "../types/request";

export const getAllRepliesForComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { comment_id } = req.params;

  try {
    const replies = await getRepliesForCommentModel(comment_id);

    res.status(200).send({ replies });
  } catch (error) {
    next(error);
  }
};

export const createReply = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const { comment_id } = req.params;
  const { username } = req.user;
  const { body } = req.body;

  try {
    const reply = await createReplyModel(comment_id, username, body);

    res.status(201).send({ reply });
  } catch (error) {
    next(error);
  }
};
