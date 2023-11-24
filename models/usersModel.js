const db = require("../db/connection");
const { comparePassword } = require("../middleware/authMiddleware");

exports.createUserModel = async (username, name, password, avatar_url) => {
  const existingUser = await db.query(
    `
  SELECT username FROM users WHERE username=$1
  `,
    [username],
  );

  if (existingUser.rows.length > 0) {
    return Promise.reject({ errCode: 409, errMsg: "User already exists" });
  }

  let user
  if (avatar_url) {
    user = await db.query(
      `
    INSERT INTO users (username, name, password, avatar_url)
    VALUES ($1, $2, $3, $4) RETURNING *
    `,
      [username, name, password, avatar_url],
    );
  } else {
    user = await db.query(
    `
    INSERT INTO users (username, name, password)
    VALUES ($1, $2, $3) RETURNING *
    `,
      [username, name, password],
    );
  }

  return user.rows[0];
};

exports.signUserInModel = async (username, password) => {
  const user = await db.query(
    `
    SELECT * FROM users WHERE username=$1
  `,
    [username],
  );

  if (!user.rows.length) {
    return Promise.reject({ errCode: 404, errMsg: "User not found" });
  }

  const isValid = await comparePassword(password, user.rows[0].password);

  if (!isValid)
    return Promise.reject({ errCode: 401, errMsg: "Incorrect password" });

  delete user.password;

  return user.rows[0];
};

exports.getAllUsersModel = async () => {
  const users = await db.query(
    `
  SELECT * FROM users;
  `,
  );

  for (let i = 0; i < users.rows.length; i++) {
    delete users.rows[i].password;
  }

  return users.rows;
};

exports.getUserByUsernameModel = async (username) => {
  const user = await db.query(
    `
    SELECT * FROM users WHERE username=$1
    `,
    [username],
  );

  if (user.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "User not found" });

  delete user.rows[0].password;

  return user.rows[0];
};
