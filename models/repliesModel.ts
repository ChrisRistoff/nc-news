import { QueryResult } from "pg";
import db from "../db/connection";

export const getRepliesForCommentModel = async (comment_id: string) => {
  const comment: QueryResult = await db.query(
    `
  SELECT comment_id FROM comments WHERE comment_id = $1
  `,
    [comment_id],
  );

  if (comment.rows.length < 1) {
    return Promise.reject({ errCode: 404, errMsg: "Comment not found" });
  }

  const replies: QueryResult = await db.query(
    `
  SELECT * FROM replies WHERE comment_id = $1
  `,
    [comment_id],
  );

  return replies.rows;
};

export const createReplyModel = async (
  comment_id: string,
  author: string,
  body: string,
) => {
  if (!body) return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
  const comment: QueryResult = await db.query(
    `
  SELECT comment_id FROM comments WHERE comment_id=$1
  `,
    [comment_id],
  );

  if (comment.rows.length < 1) {
    return Promise.reject({ errCode: 404, errMsg: "Comment not found" });
  }

  const reply: QueryResult = await db.query(
    `
  INSERT INTO replies (body, author, comment_id)
  VALUES ($1, $2, $3) RETURNING *
  `,
    [body, author, comment_id],
  );

  return reply.rows[0];
};

export const deleteReplyByIdModel = async (
  reply_id: string,
  username: string,
) => {
  const reply: QueryResult = await db.query(
    `
  SELECT author FROM replies WHERE reply_id=$1
  `,
    [reply_id],
  );

  if (reply.rows.length < 1) {
    return Promise.reject({ errCode: 404, errMsg: "Reply not found" });
  }

  if (reply.rows[0].author !== username) {
    return Promise.reject({
      errCode: 401,
      errMsg: "Reply belongs to another user",
    });
  }

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

  const reply: QueryResult = await db.query(`
  SELECT author FROM replies where reply_id = $1
  `, [reply_id])

  if (reply.rows.length < 1) {
    return Promise.reject({errCode: 404, errMsg: "Reply not found"})
  }

  if(reply.rows[0].author !== author) {
    return Promise.reject({errCode: 401, errMsg: "Reply belongs to another user"})
  }

  const newReply: QueryResult = await db.query(`
  UPDATE replies
  SET body = $1
  WHERE reply_id = $2
  RETURNING *
  `, [body, reply_id])

  return newReply.rows[0]
};

export const updateReplyVoteModel = async (reply_id: string, inc_votes: string) => {
   if (isNaN(+inc_votes)) {
    return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
  }

  const reply: QueryResult = await db.query(
    `
    SELECT votes FROM replies WHERE reply_id = $1
  `,
    [reply_id],
  );

  if (reply.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "Reply not found" });

  const newVotes: number = reply.rows[0].votes + +inc_votes;

  const newReply: QueryResult = await db.query(
    `
    UPDATE replies
    SET votes = $2
    WHERE reply_id = $1
    RETURNING *
    `,
    [reply_id, newVotes],
  );

  return newReply.rows[0];

}
