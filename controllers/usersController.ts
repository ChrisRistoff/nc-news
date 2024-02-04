import { NextFunction, Request, Response } from "express";
import { hashPassword, createJWT } from "../middleware/authMiddleware";
import { CustomRequest } from "../types/request";
import {createUserModel} from "../models/usersModels/protectedUserModel";
import {
  getAllUsersModel,
  getUserArticlesModel,
  getUserByUsernameModel, getUserCommentsModel,
  signUserInModel
} from "../models/usersModels/usersModel";




export const createUser = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {

  // get the user data from the request body
  const { name, username, password, avatar_url } = req.body;

  // hash the password
  const hashedPw = await hashPassword(password);

  try {

    // create the user
    const user = await createUserModel(username, name, hashedPw, avatar_url);

    // create a jwt token
    const token = createJWT(user);

    // set the user in the request object
    req.user = { username: user.username };

    // send the token
    res.status(201).send({ token });

  } catch (error) {

    // handle the error
    next(error);
  }
};



export const signUserIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  // get the username and password from the request body
  const { username, password } = req.body;

  try {

    // sign the user in
    const user = await signUserInModel(username, password);

    // create a jwt token
    const token = createJWT(user);

    // send the token
    res.status(200).send({ token });

  } catch (error) {

    // handle the error
    next(error);
  }
};



export const getAllUsers = async (
  _: Request,
  res: Response,
  next: NextFunction,
) => {

  try {

    // get all users
    const users = await getAllUsersModel();

    // send the users
    res.status(200).send({ users });

  } catch (error) {

    // handle the error
    next(error);
  }
};



export const getUserByUsername = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  // get the username from the request parameters
  const { username } = req.params;

  try {

    // get the user by username
    const user = await getUserByUsernameModel(username);

    // send the user
    res.status(200).send({ user });

  } catch (error) {

    // handle the error
    next(error);
  }
};

export const getUserArticles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  // get the username from the request parameters
  const { username } = req.params;

  // get the page number from the query
  let p: any;
  ({p} = req.query);

  try {

    // get the user's articles
    const data = await getUserArticlesModel(username, p);

    // send the articles
    res.status(200).send({ articles: data[0], total_count: data[1] });

  } catch (error) {

    // handle the error
    next(error);
  }
}



export const getUserComments = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  // get the username from the request parameters
  const { username } = req.params;

  // get the page number from the query
  let p: any;
  ({p} = req.query);

  try {

    // get the user's comments
    const data = await getUserCommentsModel(username, p);

    // send the comments
    res.status(200).send({ comments: data[0], total_count: data[1]});

  } catch (error) {

    // handle the error
    next(error);
  }
};
