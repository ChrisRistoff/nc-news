import { NextFunction, Request, Response } from "express";

export const sqlErrors = (
  err: any,
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.code === "22P02") {
    return res.status(400).send({ msg: "Invalid input" });
  }
  if (err.code === "23503") {
    return res.status(400).send({ msg: "Bad request" });
  }
  if (err.code === "23505") {
    return res.status(409).send({ msg: "Already exists" });
  }

  next(err);
};

export const customErrors = (
  err: any,
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.errCode) {
    return res.status(err.errCode).send({ msg: err.errMsg });
  }

  next(err);
};

export const serverError = (
  err: any,
  _: Request,
  res: Response,
  __: NextFunction,
) => {
  console.log(err);
  return res.status(500).send({ msg: "Internal server error" });
};
