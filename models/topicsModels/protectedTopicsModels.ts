import {QueryResult} from "pg";
import db from "../../db/connection";




export const createTopicModel = async (
  slug: string,
  description: string,
  creator: string,
) => {

  // if the slug or description is missing, return 400
  if (!slug || !description)
    return Promise.reject({ errCode: 400, errMsg: "Invalid input" });

  // create the topic in the database
  const topic: QueryResult = await db.query(
    `
    INSERT INTO topics (creator, slug, description)
    VALUES ($3, $1, $2) RETURNING *
    `,
    [slug, description, creator],
  );

  // return the topic object
  return topic.rows[0];
};
