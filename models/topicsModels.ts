import db from "../db/connection"

export const getAllTopicsModel = async () => {
  const topics = await db.query(`
    SELECT * FROM topics;
  `);

  return topics.rows;
};

export const createTopicModel = async (slug: string, description: string, creator: string) => {
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

export const getActiveUsersInTopicModel = async (topic: string) => {
  const checkTopic = await db.query(`
  SELECT slug FROM topics WHERE slug = $1
  `, [topic])

  if (checkTopic.rows.length < 1) {
    return Promise.reject({errCode: 404, errMsg: "Topic not found"})
  }

  const users = await db.query(`
  SELECT u.username, u.name, u.avatar_url
  FROM articles a
  JOIN users u
  ON a.author = u.username
  WHERE a.topic = $1
  GROUP BY u.username
  `, [topic])

  return users.rows
}
