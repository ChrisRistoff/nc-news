const { hashPassword, createJWT } = require("../middleware/authMiddleware");
const {
  getAllUsersModel,
  getUserByUsernameModel,
  createUserModel,
  signUserInModel,
} = require("../models/usersModel");

exports.createUser = async (req, res, next) => {
  const { name, username, password, avatar_url } = req.body;
  const hashedPw = await hashPassword(password);


  try {
    const user = await createUserModel(username, name, hashedPw, avatar_url);
    const token = createJWT(user);

    req.user = {username: user.username}

    res.status(201).send({ token });
  } catch (error) {
    next(error);
  }
};

exports.signUserIn = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await signUserInModel(username, password);

    const token = createJWT(user);

    res.status(200).send({ token });
  } catch (error) {
    next(error);
  }
};

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
