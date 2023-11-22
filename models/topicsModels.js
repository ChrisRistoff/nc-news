const db = require("../db/connection");

exports.getAllTopicsModel = async () => {
  const topics = await db.query(`
    SELECT * FROM topics;
  `);

  return topics.rows;
};

exports.createTopicModel = async (slug, description) => {
  if (!slug || !description)
    return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
  const topic = await db.query(
    `
    INSERT INTO topics (slug, description)
    VALUES ($1, $2) RETURNING *
    `,
    [slug, description],
  );

  return topic.rows[0];
};
