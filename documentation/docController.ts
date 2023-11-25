import { NextFunction, Request, Response } from "express";
import { getDocsModel } from "./docsModel"

export const getDocs = async (_: Request, res: Response, next: NextFunction) => {
  try {
    const documentation = await getDocsModel()

    res.status(200).send(documentation);
  } catch (error) {
    next(error)
  }
};
