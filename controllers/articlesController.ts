import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../types/request";
import {getAllArticlesModel, getArticleByIdModel} from "../models/articlesModels/articlesModel";
import {
  createArticleModel,
  deleteArticleModel, updateArticleBodyModel,
  updateArticleByIdModel
} from "../models/articlesModels/protectedArticlesModel";




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
    limit,
    search

  }= req.query;

  try {

    // get all articles
    const result = await getAllArticlesModel(topic, order, sort_by, p, limit, search);

    // send response
    res.status(200).send({ articles: result[0], total_count: result[1] });

  } catch (error) {

    // handle error
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

    // get article by id
    const article = await getArticleByIdModel(article_id);

    // send response
    res.status(200).send({ article });

  } catch (error) {

    // handle error
    next(error);
  }
};


export const updateArticleById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  // get inc_votes and article_id
  const { inc_votes } = req.body;
  const { article_id } = req.params;

  try {

    // update article by id
    const newArticle = await updateArticleByIdModel(article_id, inc_votes);

    // send response
    res.status(200).send({ newArticle });

  } catch (error) {

    // handle error
    next(error);
  }
};



export const createArticle = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {

  // get title, body, topic, article_img_url and author
  const { title, body, topic, article_img_url } = req.body;
  const author = req.user.username;

  try {

    // create article
    const article = await createArticleModel(
      author,
      title,
      body,
      topic,
      article_img_url,
    );

    // send response
    res.status(201).send({ article });

  } catch (error) {

    // handle error
    next(error);
  }
};



export const deleteArticle = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {

  // get article_id and username
  const { article_id } = req.params;
  const username = req.user.username;

  try {

    // delete article
    await deleteArticleModel(article_id, username);

    // send response
    res.status(204).send();

  } catch (error) {

    // handle error
    next(error);
  }
};



export const editArticleBody = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {

  // get article_id, body and username
  const { article_id } = req.params;
  const { body } = req.body;
  const { username } = req.user;

  try {

    // update article body
    const article = await updateArticleBodyModel(article_id, username, body);

    // send response
    res.status(200).send({ article });

  } catch (error) {

    // handle error
    next(error);
  }
};
