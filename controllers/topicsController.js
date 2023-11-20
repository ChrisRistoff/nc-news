const { getAllTopicsModel } = require("../models/topicsModels");

exports.getAllTopics = async (req, res, next) => {
  try {
    const topics = await getAllTopicsModel();

    res.status(200).send({ topics });
  } catch (error) {
    console.log(error)
  }
};
