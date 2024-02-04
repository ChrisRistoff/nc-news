import { NextFunction, Request, Response } from "express";




export const sqlErrors = (
  err: any,
  _: Request,
  res: Response,
  next: NextFunction,
) => {

  // invalid input
  if (err.code === "22P02") {
    return res.status(400).send({ msg: "Invalid input" });
  }

  // bad request
  if (err.code === "23503") {
    return res.status(400).send({ msg: "Bad request" });
  }

  // already exists
  if (err.code === "23505") {
    return res.status(409).send({ msg: "Already exists" });
  }

  // go to the next error handler
  next(err);
};



export const customErrors = (
  err: any,
  _: Request,
  res: Response,
  next: NextFunction,
) => {

  // if the error has an error code, return the error code and message
  if (err.errCode) {
    return res.status(err.errCode).send({ msg: err.errMsg });
  }

  // go to the next error handler
  next(err);
};



export const serverError = (
  err: any,
  _: Request,
  res: Response,
  __: NextFunction,
) => {

  // for any other error, return 500 and log the error
  console.log(err);
  return res.status(500).send({ msg: "Internal server error" });
};
