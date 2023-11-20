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
  `)

  return articles.rows
}
