const db = require("../db/connection")

exports.getArticleByIdModel = async (article_id) => {
  const article = await db.query(`
    SELECT * FROM articles WHERE article_id = $1
  `, [article_id])

  if (article.rows.length < 1) return Promise.reject({errCode: 404, errMsg: "Article ID not found"})

  return article.rows[0]
}
