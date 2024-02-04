import { QueryResult } from "pg";
import db from "../../db/connection";




export const createReplyModel = async (
  comment_id: string,
  author: string,
  body: string,
) => {

  // if the body is missing, return 400
  if (!body) return Promise.reject({ errCode: 400, errMsg: "Invalid input" });

  // get the comment by id
  const comment: QueryResult = await db.query(
    `
  SELECT comment_id FROM comments WHERE comment_id=$1
  `,
    [comment_id],
  );

  // if the comment is not found, return 404
  if (comment.rows.length < 1) {
    return Promise.reject({ errCode: 404, errMsg: "Comment not found" });
  }

  // create the reply in the database
  const reply: QueryResult = await db.query(
    `
  INSERT INTO replies (body, author, comment_id)
  VALUES ($1, $2, $3) RETURNING *
  `,
    [body, author, comment_id],
  );

  // return the reply object
  return reply.rows[0];
};



export const deleteReplyByIdModel = async (
  reply_id: string,
  username: string,
) => {

  // get the reply by id
  const reply: QueryResult = await db.query(
    `
  SELECT author FROM replies WHERE reply_id=$1
  `,
    [reply_id],
  );

  // if the reply is not found, return 404
  if (reply.rows.length < 1) {
    return Promise.reject({ errCode: 404, errMsg: "Reply not found" });
  }

  // if the reply belongs to another user, return 401
  if (reply.rows[0].author !== username) {
    return Promise.reject({
      errCode: 401,
      errMsg: "Reply belongs to another user",
    });
  }

  // delete the reply from the database
  await db.query(
    `
  DELETE FROM replies WHERE reply_id=$1
  `,
    [reply_id],
  );

  return;
};



export const editReplyBodyModel = async (
  reply_id: string,
  author: string,
  body: string,
) => {

  // get the reply by id
  const reply: QueryResult = await db.query(`
  SELECT author FROM replies where reply_id = $1
  `, [reply_id])

  // if the reply is not found, return 404
  if (reply.rows.length < 1) {
    return Promise.reject({errCode: 404, errMsg: "Reply not found"})
  }

  // if the reply belongs to another user, return 401
  if(reply.rows[0].author !== author) {
    return Promise.reject({errCode: 401, errMsg: "Reply belongs to another user"})
  }

  // update the reply in the database
  const newReply: QueryResult = await db.query(`
  UPDATE replies
  SET body = $1
  WHERE reply_id = $2
  RETURNING *
  `, [body, reply_id])

  // return the updated reply
  return newReply.rows[0]
};



export const updateReplyVoteModel = async (reply_id: string, inc_votes: string) => {

  // if inc_votes is not a number, return 400
  if (isNaN(+inc_votes)) {
    return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
  }

  // get the reply by id
  const reply: QueryResult = await db.query(
    `
    SELECT votes FROM replies WHERE reply_id = $1
  `,
    [reply_id],
  );

  // if the reply is not found, return 404
  if (reply.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "Reply not found" });

  // calculate the new votes
  const newVotes: number = reply.rows[0].votes + +inc_votes;

  // update the reply with the new votes
  const newReply: QueryResult = await db.query(
    `
    UPDATE replies
    SET votes = $2
    WHERE reply_id = $1
    RETURNING *
    `,
    [reply_id, newVotes],
  );

  // return the updated reply
  return newReply.rows[0];
}

