const db = require("../db/connection")

exports.getAllArticlesModel = async () => {
  const articles = await db.query(`
    SELECT
      a.author,
      a.title,
      a.article_id,
      a.topic,
      a.created_at,
      a.votes,
      a.article_img_url,
      CAST(COUNT(c.comment_id) AS INTEGER) AS comment_count
    FROM articles a
    LEFT JOIN comments c
    ON c.article_id = a.article_id
    GROUP BY a.article_id
    ORDER BY a.created_at DESC
  `)

  return articles.rows
}

exports.getArticleByIdModel = async (article_id) => {
  const article = await db.query(`
    SELECT
      a.*, CAST(COUNT(c.comment_id) AS INTEGER) AS comment_count
    FROM articles a
    LEFT JOIN comments c
    ON c.article_id = a.article_id
    WHERE a.article_id = $1
    GROUP BY a.article_id
  `, [article_id])

  if (article.rows.length < 1) return Promise.reject({errCode: 404, errMsg: "Article ID not found"})

  return article.rows[0]
}

exports.updateArticleByIdModel = async (article_id, inc_votes) => {

  if(isNaN(+inc_votes)) {
    return Promise.reject({errCode: 400, errMsg: "Invalid input for increment votes"})
  }

  const article = await this.getArticleByIdModel(article_id)

  if(!article.article_id)
    return Promise.reject({errCode: 404, errMsg: "Article ID not found"})

  const newVotes = article.votes + +inc_votes

  const newArticle = await db.query(
    `
    UPDATE articles
    SET votes = $2
    WHERE article_id = $1
    RETURNING *
    `, [article_id, newVotes])

  return newArticle.rows[0]
}
