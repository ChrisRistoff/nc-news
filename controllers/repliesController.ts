import { Request, Response, NextFunction } from "express";
import {
  createReplyModel,
  deleteReplyByIdModel,
  editReplyBodyModel,
  getRepliesForCommentModel,
  updateReplyVoteModel,
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

export const deleteReplyById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const { username } = req.user;
  const { reply_id } = req.params;

  try {
    await deleteReplyByIdModel(reply_id, username);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const editReplyBody = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const { reply_id } = req.params;
  const { username } = req.user;
  const { body } = req.body;

  try {
    const reply = await editReplyBodyModel(reply_id, username, body);

    res.status(200).send({ reply });
  } catch (error) {
    next(error);
  }
};

export const updateReplyVote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { inc_votes } = req.body;
  const { reply_id } = req.params;

  try {
    const reply = await updateReplyVoteModel(reply_id, inc_votes);

    res.status(200).send({ reply });
  } catch (error) {
    next(error);
  }
};
