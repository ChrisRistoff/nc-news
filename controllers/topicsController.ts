import { NextFunction, Request, Response } from "express";
import {
  getAllTopicsModel,
  createTopicModel,
  getActiveUsersInTopicModel,
} from "../models/topicsModels";
import { CustomRequest } from "../types/request";

export const getAllTopics = async (
  _: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const topics = await getAllTopicsModel();

    res.status(200).send({ topics });
  } catch (error) {
    next(error);
  }
};

export const createTopic = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  const { slug, description } = req.body;
  const creator = req.user.username;

  try {
    const topic = await createTopicModel(slug, description, creator);

    res.status(201).send({ topic });
  } catch (error) {
    next(error);
  }
};

export const getActiveUsersInTopic = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { topic } = req.params;

  try {
    const users = await getActiveUsersInTopicModel(topic);

    res.status(200).send({ users });
  } catch (error) {
    next(error);
  }
};
