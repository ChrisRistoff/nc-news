const db = require("../db/connection");

exports.getAllTopicsModel = async () => {
  const topics = await db.query(`
    SELECT * FROM topics;
  `);

  return topics.rows;
};

exports.createTopicModel = async (slug, description, creator) => {
  if (!slug || !description)
    return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
  const topic = await db.query(
    `
    INSERT INTO topics (creator, slug, description)
    VALUES ($3, $1, $2) RETURNING *
    `,
    [slug, description, creator],
  );

  return topic.rows[0];
};
