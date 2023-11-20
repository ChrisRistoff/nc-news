const db = require("../db/connection")

exports.getAllTopicsModel = async () => {
  const topics = await db.query(`
    SELECT * FROM topics;
  `)

  return topics.rows
}
