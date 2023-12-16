import { NextFunction, Request, Response } from "express";
import {
  getArticleByIdModel,
  getAllArticlesModel,
  updateArticleByIdModel,
  createArticleModel,
  deleteArticleModel,
  updateArticleBodyModel,
} from "../models/articlesModel";
import { CustomRequest } from "../types/request";

export const getAllArticles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    topic,
    order,
    sort_by,
    p,
    limit
  }= req.query;

  const {search} = req.body;

  try {
    const result = await getAllArticlesModel(topic, order, sort_by, p, limit, search);

    res.status(200).send({ articles: result[0], total_count: result[1] });
  } catch (error) {
    next(error);
  }
};

export const getArticleById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { article_id } = req.params;

  try {
    const article = await getArticleByIdModel(article_id);

    res.status(200).send({ article });
  } catch (error) {
    next(error);
  }
};


export const updateArticleById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  try {
    const newArticle = await updateArticleByIdModel(article_id, inc_votes);

    res.status(200).send({ newArticle });
  } catch (error) {
    next(error);
  }
};

export const createArticle = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const { title, body, topic, article_img_url } = req.body;
  const author = req.user.username;

  try {
    const article = await createArticleModel(
      author,
      title,
      body,
      topic,
      article_img_url,
    );

    res.status(201).send({ article });
  } catch (error) {
    next(error);
  }
};

export const deleteArticle = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const { article_id } = req.params;
  const username = req.user.username;

  try {
    await deleteArticleModel(article_id, username);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const editArticleBody = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { article_id } = req.params;
    const { body } = req.body;
    const { username } = req.user;

    const article = await updateArticleBodyModel(article_id, username, body);

    res.status(200).send({ article });
  } catch (error) {
    next(error);
  }
};
