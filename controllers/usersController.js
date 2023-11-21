const { getAllUsersModel } = require("../models/usersModel");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersModel();

    res.status(200).send({ users });
  } catch (error) {
    next(error);
  }
};
