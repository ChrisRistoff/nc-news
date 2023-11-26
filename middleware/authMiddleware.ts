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
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign(
    {
      username: user.username,
    },
    secret,
  );

  return token;
};

export const protect = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    return res.status(401).send({ msg: "You need to be logged in" });
  }

  const split_token = bearer.split(" ");
  const token = split_token[1];

  if (!token) {
    return res.status(401).send({ msg: "Token is not valid" });
  }

  try {
    const secret = process.env.JWT_SECRET;
    const user = jwt.verify(token, secret);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send({ msg: "Token is not valid" });
  }
};
