const db = require("../db/connection");
const { getArticleByIdModel } = require("./articlesModel");

exports.createCommentForArticleModel = async (body, article_id, username) => {

  if(!body) return Promise.reject({errCode: 400, errMsg: "Body can not be empty"})

  const article = await getArticleByIdModel(article_id)

  if (article.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "Article ID not found" });

  const comment = await db.query(
    `
    INSERT INTO comments (body, article_id, author)
    VALUES ($1, $2, $3) RETURNING *
  `,
    [body, article_id, username],
  );

  return comment.rows[0];
};

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

exports.deleteCommentByIdModel = async (comment_id) => {
  const comment = await db.query(
    `
    SELECT comment_id FROM comments WHERE comment_id = $1
    `, [comment_id])

  if(comment.rows.length < 1) return Promise.reject({errCode: 404, errMsg: "Comment does not exist"})

  return db.query(`
  DELETE FROM comments WHERE comment_id = $1
  `, [comment_id])
}
