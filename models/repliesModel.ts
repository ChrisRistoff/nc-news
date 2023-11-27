import db from "../db/connection"

export const getRepliesForCommentModel = async (comment_id: string) => {
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

export const createReplyModel = async (comment_id: string, author: string, body: string) => {
  if(!body) return Promise.reject({errCode: 400, errMsg: "Invalid input"})
  const comment = await db.query(`
  SELECT comment_id FROM comments WHERE comment_id=$1
  `, [comment_id])

  if (comment.rows.length < 1) {
    return Promise.reject({errCode: 404, errMsg: "Comment not found"})
  }

  const reply = await db.query(`
  INSERT INTO replies (body, author, comment_id)
  VALUES ($1, $2, $3) RETURNING *
  `, [body, author, comment_id])

  return reply.rows[0]
}
