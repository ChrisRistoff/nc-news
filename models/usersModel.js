const db = require("../db/connection")

exports.getAllUsersModel = async () => {
  const users = await db.query(`
  SELECT * FROM users;
  `)

  return users.rows
}
