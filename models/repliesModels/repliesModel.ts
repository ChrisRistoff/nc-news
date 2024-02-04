import { QueryResult } from "pg";
import db from "../../db/connection";



export const getRepliesForCommentModel = async (comment_id: string) => {

  // get the comment by id
  const comment: QueryResult = await db.query(
    `
  SELECT comment_id FROM comments WHERE comment_id = $1
  `,
    [comment_id],
  );

  // if the comment is not found, return 404
  if (comment.rows.length < 1) {
    return Promise.reject({ errCode: 404, errMsg: "Comment not found" });
  }

  // get the replies for the comment
  const replies: QueryResult = await db.query(
    `
  SELECT * FROM replies WHERE comment_id = $1
  `,
    [comment_id],
  );

  // return the replies
  return replies.rows;
};
