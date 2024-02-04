import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../types/request";
import {getActiveUsersInTopicModel, getAllTopicsModel} from "../models/topicsModels/topicsModels";
import {createTopicModel} from "../models/topicsModels/protectedTopicsModels";

export const getAllTopics = async (
  _: Request,
  res: Response,
  next: NextFunction,
) => {

  try {

    // get all topics
    const topics = await getAllTopicsModel();

    // send the topics
    res.status(200).send({ topics });

  } catch (error) {

    // handle the error
    next(error);
  }
};



export const createTopic = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {

  // get the slug and description from the request
  const { slug, description } = req.body;
  const creator = req.user.username;

  try {

    // create the topic
    const topic = await createTopicModel(slug, description, creator);

    // send the topic object
    res.status(201).send({ topic });

  } catch (error) {

    // handle the error
    next(error);
  }
};



export const getActiveUsersInTopic = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  // get the topic from the request
  const { topic } = req.params;

  try {

    // get the active users in the topic
    const users = await getActiveUsersInTopicModel(topic);

    // send the users
    res.status(200).send({ users });

  } catch (error) {

    // handle the error
    next(error);
  }
};
