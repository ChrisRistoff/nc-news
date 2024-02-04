import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextFunction, Response } from "express";
import { CustomRequest } from "../types/request";




export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};



export const comparePassword = (password: string, hashedPassword: string) => {
  return bcrypt.compare(password, hashedPassword);
};



export const createJWT = (user: any) => {

  // get the secret from the environment
  const secret = process.env.JWT_SECRET;

  // create a jwt token
  const token = jwt.sign(
    {
      username: user.username,
    },
    secret,
  );

  // return the token
  return token;
};



export const protect = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {

  // get the token from the request headers
  const bearer = req.headers.authorization;

  // if the token is not found, return 401
  if (!bearer) {
    return res.status(401).send({ msg: "You need to be logged in" });
  }

  // split the token
  const split_token = bearer.split(" ");

  // get the token from the split
  const token = split_token[1];

  // if the token is not found, return 401
  if (!token) {
    return res.status(401).send({ msg: "Token is not valid" });
  }

  try {

    // get the secret from the environment
    const secret = process.env.JWT_SECRET;

    // verify the token
    const user = jwt.verify(token, secret);

    // set the user on the request object
    req.user = user;

    // move to the next middleware
    next();

  } catch (error) {

    // if any error occurs, return 401
    return res.status(401).send({ msg: "Token is not valid" });
  }
};
