import { QueryResult } from "pg";
import db from "../../db/connection";




export const getAllTopicsModel = async () => {

  // get all topics
  const topics: QueryResult = await db.query(`
    SELECT
        t.*,
        CAST(COUNT(a.article_id) AS INTEGER) AS article_count
    FROM topics t
    JOIN articles a
    ON t.slug = a.topic
    GROUP BY t.slug
  `);

  // return the topics
  return topics.rows;
};



export const getActiveUsersInTopicModel = async (topic: string) => {

  // check if the topic exists
  const checkTopic: QueryResult = await db.query(
    `
  SELECT slug FROM topics WHERE slug = $1
  `,
    [topic],
  );

  // if the topic does not exist, return 404
  if (checkTopic.rows.length < 1) {
    return Promise.reject({ errCode: 404, errMsg: "Topic not found" });
  }

  // get the active users in the topic
  const users: QueryResult = await db.query(
    `
  SELECT u.username, u.name, u.avatar_url
  FROM articles a
  JOIN users u
  ON a.author = u.username
  WHERE a.topic = $1
  GROUP BY u.username
  `,
    [topic],
  );

  // return the users
  return users.rows;
};
