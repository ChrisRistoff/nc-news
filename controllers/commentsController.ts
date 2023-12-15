import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../types/request";

import {
  createCommentForArticleModel,
  deleteCommentByIdModel,
  updateCommentByIdModel,
  getAllCommentsForArticleModel,
  editCommentByIdModel,
} from "../models/commentsModel";

export const createCommentForArticle = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const { body } = req.body;
  const { article_id } = req.params;
  const { username } = req.user;

  try {
    const comment = await createCommentForArticleModel(
      body,
      article_id,
      username,
    );

    res.status(201).send({ comment });
  } catch (error) {
    next(error);
  }
};

export const getAllCommentsForArticle = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { article_id } = req.params;
  const { p, limit } = req.query;

  try {
    const comments = await getAllCommentsForArticleModel(article_id, p, limit);

    res.status(200).send({ comments: comments[0], total_count: comments[1] });
  } catch (error) {
    next(error);
  }
};

export const deleteCommentById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const { comment_id } = req.params;
  const { username } = req.user;

  try {
    await deleteCommentByIdModel(comment_id, username);

    res.status(204).send({});
  } catch (error) {
    next(error);
  }
};

export const updateCommentById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;

  try {
    const newComment = await updateCommentByIdModel(comment_id, inc_votes);

    res.status(200).send({ newComment });
  } catch (error) {
    next(error);
  }
};

export const editCommentById = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const { comment_id } = req.params;
  const { body } = req.body;
  const { username } = req.user;

  try {
    const comment = await editCommentByIdModel(comment_id, body, username);

    res.status(200).send({ comment });
  } catch (error) {
    next(error);
  }
};
