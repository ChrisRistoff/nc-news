const { getAllTopicsModel } = require("../middleware/topicsMiddleware");

exports.getAllTopics = async (req, res, next) => {
  try {
    const topics = await getAllTopicsModel();

    res.status(200).send({ topics });
  } catch (error) {
    console.log(error)
  }
};
