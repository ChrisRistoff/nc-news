const { getDocsModel } = require("./docsModel");

exports.getDocs = async (req, res, next) => {
  try {
    const documentation = await getDocsModel()

    res.status(200).send(documentation);
  } catch (error) {
    next(error)
  }
};
