const {
  getAllTopicsModel,
  createTopicModel,
  getActiveUsersInTopicModel,
} = require("../models/topicsModels");

exports.getAllTopics = async (req, res, next) => {
  try {
    const topics = await getAllTopicsModel();

    res.status(200).send({ topics });
  } catch (error) {
    console.log(error);
  }
};

exports.createTopic = async (req, res, next) => {
  const { slug, description } = req.body;
  const creator = req.user.username;

  try {
    const topic = await createTopicModel(slug, description, creator);

    res.status(201).send({ topic });
  } catch (error) {
    next(error);
  }
};

exports.getActiveUsersInTopic = async (req, res, next) => {
  const { topic } = req.params;

  try {
    const users = await getActiveUsersInTopicModel(topic);

    res.status(200).send({ users });
  } catch (error) {
    next(error);
  }
};
