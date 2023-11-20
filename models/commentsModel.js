const db = require("../db/connection")

exports.getAllCommentsForArticleModel = async (article_id) => {
  const article = await db.query(`
    SELECT article_id FROM articles WHERE article_id = $1
  `, [article_id])

  if (article.rows.length < 1) return Promise.reject({errCode: 404, errMsg: "Article ID not found"})

  const comments = await db.query(`
    SELECT *
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
  `, [article_id])


  return comments.rows
}
