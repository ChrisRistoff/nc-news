const db = require("../db/connection");

exports.createCommentForArticleModel = async (body, article_id, username) => {

  if(!body) return Promise.reject({errCode: 400, errMsg: "Body can not be empty"})

  const article = await db.query(
    `
    SELECT article_id FROM articles WHERE article_id = $1
  `,
    [article_id],
  );

  if (article.rows.length < 1)
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
