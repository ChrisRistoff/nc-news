import { NextFunction, Request, Response } from "express";
import { hashPassword, createJWT } from "../middleware/authMiddleware";
import {
  getAllUsersModel,
  getUserByUsernameModel,
  createUserModel,
  signUserInModel, getUserArticlesModel, getUserCommentsModel,
} from "../models/usersModel";
import { CustomRequest } from "../types/request";
import exp from "node:constants";

export const createUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const { name, username, password, avatar_url } = req.body;
  const hashedPw = await hashPassword(password);

  try {
    const user = await createUserModel(username, name, hashedPw, avatar_url);
    const token = createJWT(user);

    req.user = { username: user.username };

    res.status(201).send({ token });
  } catch (error) {
    next(error);
  }
};

export const signUserIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { username, password } = req.body;

  try {
    const user = await signUserInModel(username, password);

    const token = createJWT(user);

    res.status(200).send({ token });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await getAllUsersModel();

    res.status(200).send({ users });
  } catch (error) {
    next(error);
  }
};

export const getUserByUsername = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { username } = req.params;

  try {
    const user = await getUserByUsernameModel(username);

    res.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};

export const getUserArticles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { username } = req.params;

  try {
    const articles = await getUserArticlesModel(username);

    res.status(200).send({ articles });
  } catch (error) {
    next(error);
  }
}

export const getUserComments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { username } = req.params;

  try {
    const comments = await getUserCommentsModel(username);

    res.status(200).send({ comments });
  } catch (error) {
    next(error);
  }
};
