import { QueryResult } from "pg";
import db from "../../db/connection";
import { paginateQuery } from "../../middleware/paginate";
import { getArticleByIdModel } from "../articlesModels/articlesModel";




export const getAllCommentsForArticleModel = async (
  article_id: string,
  p: any,
  limit: any,
) => {

  // get the article by id if not found the model will throw a 404 error
  const article = await getArticleByIdModel(article_id);

  let dbQuery: string | boolean;

  // create the query string
  dbQuery = `
    SELECT *
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
  `;

  // paginate the query
  dbQuery = paginateQuery(dbQuery, p, limit);

  // if the query is invalid, return 400
  if (!dbQuery)
    return Promise.reject({ errCode: 400, errMsg: "Invalid input" });

  // get the comments from the database
  const comments: QueryResult = await db.query(dbQuery, [article_id]);

  // get the total count of comments for the article
  let total_count: QueryResult = await db.query(
    `SELECT CAST(COUNT(comment_id) AS INTEGER) as total_count FROM comments WHERE article_id = $1`
    , [article_id])

  // update the total count
  total_count = total_count.rows[0].total_count;

  // return the comments and the total count
  return [comments.rows, total_count];
};
