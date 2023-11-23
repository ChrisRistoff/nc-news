const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

exports.comparePassword = (password, hashedPassowrd) => {
  return bcrypt.compare(password, hashedPassowrd);
};

exports.createJWT = (user) => {
  const secret = process.env.JWT_SECRET;
  const token = jwt.sign(
    {
      username: user.username,
    },
    secret,
  );

  return token;
};

exports.protect = (req, res, next) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    return res.status(401).send({ msg: "You need to be logged in" });
  }

  const split_token = bearer.split(" ");
  const token = split_token[1];

  if (!token) {
    return res.status(401).send({ msg: "Token is not valid" });
  }

  try {
    const secret = process.env.JWT_SECRET
    const user = jwt.verify(token, secret)
    req.user = user
    next()
  } catch (error) {
    return res.status(401).send({msg: "Token is not valid"})
  }
};
