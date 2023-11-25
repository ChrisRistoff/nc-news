import db from "../db/connection";
import { paginateQuery } from "../middleware/paginate";
import { getUserByUsernameModel } from "./usersModel";

const orders = ["asc", "desc"];
const sortBy = new Set([
  "title",
  "topic",
  "author",
  "created_at",
  "votes",
  "comment_count",
  "article_id",
]);

export const getAllArticlesModel = async (
  topic: any,
  order: any,
  sort_by: any,
  p: any,
  limit: any,
) => {
  let dbQuery: string | boolean

  dbQuery = `
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
  `;
  if (topic) {
    const checkTopic = await db.query(
      `SELECT slug FROM topics WHERE slug = $1`,
      [topic],
    );

    if (checkTopic.rows.length < 1)
      return Promise.reject({ errCode: 404, errMsg: "Topic not found" });
    dbQuery += `WHERE topic = $1`;
  }

  if (sort_by) {
    if (!sortBy.has(sort_by))
      return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
    if (sort_by !== "comment_count") sort_by = "a." + sort_by;
  } else {
    sort_by = "a.created_at";
  }

  if (order) {
    if (!orders.includes(order))
      return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
  } else {
    order = "DESC";
  }

  dbQuery += `
    GROUP BY a.article_id
    ORDER BY ${sort_by} ${order.toUpperCase()}
    `;

  dbQuery = paginateQuery(dbQuery, p, limit);
  if (!dbQuery)
    return Promise.reject({ errCode: 400, errMsg: "Invalid input" });

  let articles: any;

  if (topic) articles = await db.query(dbQuery, [topic]);
  else articles = await db.query(dbQuery);

  let total_count = await db.query(
    `SELECT CAST(COUNT(article_id) AS INTEGER) as total_count FROM articles;`,
  );

  total_count = total_count.rows[0].total_count;

  return [articles.rows, total_count];
};

export const getArticleByIdModel = async (article_id: string) => {
  const article = await db.query(
    `
    SELECT
      a.*, CAST(COUNT(c.comment_id) AS INTEGER) AS comment_count
    FROM articles a
    LEFT JOIN comments c
    ON c.article_id = a.article_id
    WHERE a.article_id = $1
    GROUP BY a.article_id
  `,
    [article_id],
  );

  if (article.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "Article ID not found" });

  return article.rows[0];
};

export const updateArticleByIdModel = async (
  article_id: string,
  inc_votes: number,
) => {
  if (isNaN(+inc_votes)) {
    return Promise.reject({
      errCode: 400,
      errMsg: "Invalid input for increment votes",
    });
  }

  const article = await getArticleByIdModel(article_id);

  if (!article.article_id)
    return Promise.reject({ errCode: 404, errMsg: "Article ID not found" });

  const newVotes = article.votes + +inc_votes;

  const newArticle = await db.query(
    `
    UPDATE articles
    SET votes = $2
    WHERE article_id = $1
    RETURNING *
    `,
    [article_id, newVotes],
  );

  return newArticle.rows[0];
};

export const createArticleModel = async (
  author: string,
  title: string,
  body: string,
  topic: string,
  article_img_url: string,
) => {
  if (!title || !body)
    return Promise.reject({ errCode: 400, errMsg: "Invalid input" });

  await getUserByUsernameModel(author);
  const topicExists = await db.query(`SELECT slug FROM topics WHERE slug=$1`, [
    topic,
  ]);
  if (topicExists.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "Topic not found" });

  let dbQuery: string | boolean;
  let newArticle: any;
  if (article_img_url) {
    dbQuery = `
      INSERT INTO articles (author, title, body, topic, article_img_url)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;

    newArticle = await db.query(dbQuery, [
      author,
      title,
      body,
      topic,
      article_img_url,
    ]);
  } else {
    dbQuery = `
      INSERT INTO articles (author, title, body, topic)
      VALUES ($1, $2, $3, $4) RETURNING *`;
    newArticle = await db.query(dbQuery, [author, title, body, topic]);
  }

  newArticle.rows[0].comment_count = 0;

  return newArticle.rows[0];
};

export const deleteArticleModel = async (
  article_id: string,
  username: string,
) => {
  const checkArticle = await db.query(
    `
  SELECT * FROM articles WHERE article_id = $1
  `,
    [article_id],
  );

  if (checkArticle.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "Article not found" });

  if (checkArticle.rows[0].author !== username) {
    return Promise.reject({
      errCode: 401,
      errMsg: "Article belongs to another user",
    });
  }

  await db.query(
    `
    DELETE FROM comments WHERE article_id = $1
  `,
    [article_id],
  );

  await db.query(
    `
    DELETE FROM articles WHERE article_id = $1 RETURNING *
  `,
    [article_id],
  );

  return;
};

export const updateArticleBodyModel = async (
  article_id: string,
  username: string,
  body: string,
) => {
  if (!body) return Promise.reject({ errCode: 400, errMsg: "Invalid input" });

  const checkArticle = await getArticleByIdModel(article_id);

  if (checkArticle.length < 1) {
    return Promise.reject({ errCode: 404, errMsg: "Article not found" });
  }

  if (checkArticle.author !== username) {
    return Promise.reject({
      errCode: 401,
      errMsg: "Article belongs to another user",
    });
  }

  const article = await db.query(
    `
  UPDATE articles
  SET body = $1
  WHERE article_id = $2
  RETURNING *
  `,
    [body, article_id],
  );

  article.rows[0].comment_count = checkArticle.comment_count;

  return article.rows[0];
};
