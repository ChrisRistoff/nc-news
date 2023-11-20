const db = require("../db/connection")

exports.getAllCommentsForArticleModel = async (article_id) => {
  const comments = await db.query(`
    SELECT * FROM comments WHERE article_id = $1
  `, [article_id])

  if (comments.rows.length < 1) return Promise.reject({errCode: 404, errMsg: "Article ID not found"})

  return comments.rows
}
