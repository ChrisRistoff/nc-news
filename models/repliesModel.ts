import db from "../db/connection"

export const getRepliesForCommentModel = async (comment_id) => {
  const comment = await db.query(`
  SELECT comment_id FROM comments WHERE comment_id = $1
  `, [comment_id])

  if(comment.rows.length < 1) {
    return Promise.reject({errCode: 404, errMsg: "Comment not found"})
  }

  const replies = await db.query(`
  SELECT * FROM replies WHERE comment_id = $1
  `, [comment_id])

  return replies.rows
}
