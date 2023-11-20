exports.getDocs = (req, res, next) => {
  try {
    const documentation = require("./data");

    res.status(200).send({ documentation });
  } catch (error) {
    console.log(error);
  }
};
