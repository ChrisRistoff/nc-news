const db = require("../db/connection");

exports.getAllUsersModel = async () => {
  const users = await db.query(`
  SELECT * FROM users;
  `);

  return users.rows;
};

exports.getUserByUsernameModel = async (username) => {
  const user = await db.query(
    `
    SELECT * FROM users WHERE username=$1
  `,
    [username],
  );

  if (user.rows.length < 1) return Promise.reject({ errCode: 404, errMsg: "User not found" });

  return user.rows[0];
};
