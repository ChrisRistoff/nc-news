const {
  getAllTopicsModel,
  createTopicModel,
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

  try {
    const topic = await createTopicModel(slug, description);

    res.status(201).send({ topic });
  } catch (error) {
    next(error);
  }
};
