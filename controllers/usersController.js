const {
  getAllUsersModel,
  getUserByUsernameModel,
} = require("../models/usersModel");

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUsersModel();

    res.status(200).send({ users });
  } catch (error) {
    next(error);
  }
};

exports.getUserByUsername = async (req, res, next) => {
  const { username } = req.params;

  try {
    const user = await getUserByUsernameModel(username);

    res.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};
