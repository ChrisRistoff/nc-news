import {getArticleByIdModel} from "../articlesModels/articlesModel";
import {QueryResult} from "pg";
import db from "../../db/connection";



export const createCommentForArticleModel = async (
  body: string,
  article_id: string,
  username: string,
) => {

  // if body is empty, return 400
  if (!body)
    return Promise.reject({ errCode: 400, errMsg: "Body can not be empty" });

  // get the article by id if not found the model will throw a 404 error
  const article = await getArticleByIdModel(article_id);

  // insert the comment into the database
  const comment: QueryResult = await db.query(
    `
    INSERT INTO comments (body, article_id, author)
    VALUES ($1, $2, $3) RETURNING *
  `,
    [body, article_id, username],
  );

  // return the comment object
  return comment.rows[0];
};



export const deleteCommentByIdModel = async (
  comment_id: string,
  username: string,
) => {

  // get comment by id
  const comment: QueryResult = await db.query(
    `
    SELECT author FROM comments WHERE comment_id = $1
    `,
    [comment_id],
  );

  // if the comment is not found, return 404
  if (comment.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "Comment does not exist" });

  // if the comment does not belong to the user, return 401
  if (comment.rows[0].author !== username) {
    return Promise.reject({
      errCode: 401,
      errMsg: "Comment belongs to another user",
    });
  }

  // delete the comment from the database
  await db.query(
    `
  DELETE FROM comments WHERE comment_id = $1
  `,
    [comment_id],
  );

  return;
};



export const updateCommentByIdModel = async (
  comment_id: string,
  inc_votes: number,
) => {

  // if inc_votes is not a number, return 400
  if (isNaN(+inc_votes)) {
    return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
  }

  // get the comment by id
  const comment: QueryResult = await db.query(
    `
    SELECT votes FROM comments WHERE comment_id = $1
  `,
    [comment_id],
  );

  // if the comment is not found, return 404
  if (comment.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "Comment ID not found" });

  // calculate the new votes
  const newVotes: number = comment.rows[0].votes + +inc_votes;

  // update the comment with the new votes
  const newComment: QueryResult = await db.query(
    `
    UPDATE comments
    SET votes = $2
    WHERE comment_id = $1
    RETURNING *
    `,
    [comment_id, newVotes],
  );

  // return the updated comment
  return newComment.rows[0];
};



export const editCommentByIdModel = async (
  comment_id: string,
  body: string,
  author: string,
) => {

  // if body is empty, return 400
  if (!body) {
    return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
  }

  // get the comment by id
  const checkComment: QueryResult = await db.query(
    `
  SELECT author FROM comments where comment_id = $1
  `,
    [comment_id],
  );

  // if the comment is not found, return 404
  if (checkComment.rows.length < 1) {
    return Promise.reject({ errCode: 404, errMsg: "Comment ID not found" });
  }

  // if the comment does not belong to the user, return 401
  if (checkComment.rows[0].author !== author) {
    return Promise.reject({
      errCode: 401,
      errMsg: "Comment belongs to another user",
    });
  }

  // update the comment with the new body
  const comment: QueryResult = await db.query(
    `
  UPDATE comments
  SET body = $1
  WHERE comment_id = $2
  RETURNING *
  `,
    [body, comment_id],
  );

  // return the updated comment
  return comment.rows[0];
};
