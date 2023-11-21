const db = require("../db/connection")
const { getArticleByIdModel } = require("./articlesModel")

exports.getAllCommentsForArticleModel = async (article_id) => {
  const article = await getArticleByIdModel(article_id)

  if (article.length < 1) return Promise.reject({errCode: 404, errMsg: "Article ID not found"})

  const comments = await db.query(`
    SELECT *
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
  `, [article_id])


  return comments.rows
}
