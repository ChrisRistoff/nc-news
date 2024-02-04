import { Request, Response, NextFunction } from "express";
import { CustomRequest } from "../types/request";
import {getRepliesForCommentModel} from "../models/repliesModels/repliesModel";
import {
  createReplyModel,
  deleteReplyByIdModel,
  editReplyBodyModel, updateReplyVoteModel
} from "../models/repliesModels/protectedRepliesModel";




export const getAllRepliesForComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  // get the comment_id from the request
  const { comment_id } = req.params;

  try {

    // get the replies for the comment
    const replies = await getRepliesForCommentModel(comment_id);

    // send the replies
    res.status(200).send({ replies });

  } catch (error) {

    // handle the error
    next(error);
  }
};

export const createReply = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {

  // get the comment_id, username and body from the request
  const { comment_id } = req.params;
  const { username } = req.user;
  const { body } = req.body;

  try {

    // create the reply
    const reply = await createReplyModel(comment_id, username, body);

    // send the reply object
    res.status(201).send({ reply });

  } catch (error) {

    // handle the error
    next(error);
  }
};

export const deleteReplyById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {

  // get the username and reply_id from the request
  const { username } = req.user;
  const { reply_id } = req.params;

  try {

    // delete the reply by id
    await deleteReplyByIdModel(reply_id, username);

    // send 204 status
    res.status(204).send();

  } catch (error) {

    // handle the error
    next(error);
  }
};

export const editReplyBody = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {

  // get the reply_id, username and body from the request
  const { reply_id } = req.params;
  const { username } = req.user;
  const { body } = req.body;

  try {

    // edit the reply body
    const reply = await editReplyBodyModel(reply_id, username, body);

    // send the reply object
    res.status(200).send({ reply });

  } catch (error) {

    // handle the error
    next(error);
  }
};

export const updateReplyVote = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  // get the inc_votes and reply_id from the request
  const { inc_votes } = req.body;
  const { reply_id } = req.params;

  try {

    // update the reply vote
    const reply = await updateReplyVoteModel(reply_id, inc_votes);

    // send the reply object
    res.status(200).send({ reply });

  } catch (error) {

    // handle the error
    next(error);
  }
};
