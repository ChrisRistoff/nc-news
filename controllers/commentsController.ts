import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../types/request";
import {
  createCommentForArticleModel,
  deleteCommentByIdModel, editCommentByIdModel,
  updateCommentByIdModel
} from "../models/commentsModoels/protectedCommentsModels";
import {getAllCommentsForArticleModel} from "../models/commentsModoels/commentsModel";




export const createCommentForArticle = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {

  // get the body, article_id and username from the request
  const { body } = req.body;
  const { article_id } = req.params;
  const { username } = req.user;

  try {

    // create a new comment for the article
    const comment = await createCommentForArticleModel(
      body,
      article_id,
      username,
    );

    // send the comment object
    res.status(201).send({ comment });

  } catch (error) {

    // handle the error
    next(error);
  }
};



export const getAllCommentsForArticle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  // get the article_id, p and limit from the request
  const { article_id } = req.params;
  const { p, limit } = req.query;

  try {

    // get all the comments for the article
    const comments = await getAllCommentsForArticleModel(article_id, p, limit);

    // send the comments array and the total count
    res.status(200).send({ comments: comments[0], total_count: comments[1] });

  } catch (error) {

    // handle the error
    next(error);
  }
};

export const deleteCommentById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {

  // get the comment_id and username from the request
  const { comment_id } = req.params;
  const { username } = req.user;

  try {

    // delete the comment by id
    await deleteCommentByIdModel(comment_id, username);

    // send 204 status
    res.status(204).send({});

  } catch (error) {

    // handle the error
    next(error);
  }
};



export const updateCommentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  // get the comment_id and inc_votes from the request
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  try {

    // update the comment by id
    const newComment = await updateCommentByIdModel(comment_id, inc_votes);

    // send the new comment object
    res.status(200).send({ newComment });

  } catch (error) {

    // handle the error
    next(error);
  }
};



export const editCommentById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {

  // get the comment_id, body and username from the request
  const { comment_id } = req.params;
  const { body } = req.body;
  const { username } = req.user;

  try {

    // edit the comment by id
    const comment = await editCommentByIdModel(comment_id, body, username);

    // send the comment object
    res.status(200).send({ comment });

  } catch (error) {

    // handle the error
    next(error);
  }
};
