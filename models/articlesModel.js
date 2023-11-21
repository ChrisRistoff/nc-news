const db = require("../db/connection")

exports.getAllArticlesModel = async (topic) => {
  let dbQuery = `
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
  `
  if(topic) {
    const checkTopic = await db.query(`SELECT slug FROM topics WHERE slug = $1`, [topic])

    if(checkTopic.rows.length < 1) return Promise.reject({errCode: 404, errMsg: "Topic not found"})
    dbQuery += `WHERE topic = $1`
  }

  dbQuery +=
    `
    GROUP BY a.article_id
    ORDER BY a.created_at DESC
    `
  let articles

  if(topic) articles = await db.query(dbQuery, [topic])
  else articles = await db.query(dbQuery)

  return articles.rows
}

exports.getArticleByIdModel = async (article_id) => {
  const article = await db.query(`
    SELECT * FROM articles WHERE article_id = $1
  `, [article_id])

  if (article.rows.length < 1) return Promise.reject({errCode: 404, errMsg: "Article ID not found"})

  return article.rows[0]
}
