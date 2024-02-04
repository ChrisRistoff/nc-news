import { QueryResult } from "pg";
import db from "../../db/connection";
import { paginateQuery } from "../../middleware/paginate";
import { getArticleByIdModel } from "../articlesModels/articlesModel";

export const createCommentForArticleModel = async (
  body: string,
  article_id: string,
  username: string,
) => {
  if (!body)
    return Promise.reject({ errCode: 400, errMsg: "Body can not be empty" });

  const article = await getArticleByIdModel(article_id);

  if (article.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "Article ID not found" });

  const comment: QueryResult = await db.query(
    `
    INSERT INTO comments (body, article_id, author)
    VALUES ($1, $2, $3) RETURNING *
  `,
    [body, article_id, username],
  );

  return comment.rows[0];
};

export const getAllCommentsForArticleModel = async (
  article_id: string,
  p: any,
  limit: any,
) => {
  const article = await getArticleByIdModel(article_id);
  if (article.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "Article ID not found" });

  let dbQuery: string | boolean;

  dbQuery = `
    SELECT *
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
  `;

  dbQuery = paginateQuery(dbQuery, p, limit);
  if (!dbQuery)
    return Promise.reject({ errCode: 400, errMsg: "Invalid input" });

  const comments: QueryResult = await db.query(dbQuery, [article_id]);

  let total_count: QueryResult = await db.query(
    `SELECT CAST(COUNT(comment_id) AS INTEGER) as total_count FROM comments WHERE article_id = $1`
    , [article_id])

  total_count = total_count.rows[0].total_count;

  return [comments.rows, total_count];
};

export const deleteCommentByIdModel = async (
  comment_id: string,
  username: string,
) => {
  const comment: QueryResult = await db.query(
    `
    SELECT author FROM comments WHERE comment_id = $1
    `,
    [comment_id],
  );

  if (comment.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "Comment does not exist" });

  if (comment.rows[0].author !== username) {
    return Promise.reject({
      errCode: 401,
      errMsg: "Comment belongs to another user",
    });
  }

  return db.query(
    `
  DELETE FROM comments WHERE comment_id = $1
  `,
    [comment_id],
  );
};

export const updateCommentByIdModel = async (
  comment_id: string,
  inc_votes: number,
) => {
  if (isNaN(+inc_votes)) {
    return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
  }

  const comment: QueryResult = await db.query(
    `
    SELECT votes FROM comments WHERE comment_id = $1
  `,
    [comment_id],
  );

  if (comment.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "Comment ID not found" });

  const newVotes: number = comment.rows[0].votes + +inc_votes;

  const newComment: QueryResult = await db.query(
    `
    UPDATE comments
    SET votes = $2
    WHERE comment_id = $1
    RETURNING *
    `,
    [comment_id, newVotes],
  );

  return newComment.rows[0];
};

export const editCommentByIdModel = async (
  comment_id: string,
  body: string,
  author: string,
) => {
  if (!body) {
    return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
  }

  const checkComment: QueryResult = await db.query(
    `
  SELECT author FROM comments where comment_id = $1
  `,
    [comment_id],
  );

  if (checkComment.rows.length < 1) {
    return Promise.reject({ errCode: 404, errMsg: "Comment ID not found" });
  }

  if (checkComment.rows[0].author !== author) {
    return Promise.reject({
      errCode: 401,
      errMsg: "Comment belongs to another user",
    });
  }

  const comment: QueryResult = await db.query(
    `
  UPDATE comments
  SET body = $1
  WHERE comment_id = $2
  RETURNING *
  `,
    [body, comment_id],
  );

  return comment.rows[0];
};
