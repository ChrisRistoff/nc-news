const db = require("../db/connection");
const { paginateQuery } = require("../middleware/paginate");
const { getUserByUsernameModel } = require("./usersModel");
const orders = ["asc", "desc"];
const sortBy = new Set([
  "title",
  "topic",
  "author",
  "created_at",
  "votes",
  "comment_count",
  "article_id"
]);

exports.getAllArticlesModel = async (topic, order, sort_by, p, limit) => {
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

  dbQuery = paginateQuery(dbQuery, p, limit)
  if(!dbQuery) return Promise.reject({errCode: 400, errMsg: "Invalid input"})

  let articles;

  if (topic) articles = await db.query(dbQuery, [topic]);
  else articles = await db.query(dbQuery);

  return articles.rows;
};

exports.getArticleByIdModel = async (article_id) => {
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

exports.updateArticleByIdModel = async (article_id, inc_votes) => {
  if (isNaN(+inc_votes)) {
    return Promise.reject({
      errCode: 400,
      errMsg: "Invalid input for increment votes",
    });
  }

  const article = await this.getArticleByIdModel(article_id);

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

exports.createArticleModel = async (
  author,
  title,
  body,
  topic,
  article_img_url,
) => {

  if(!title || !body) return Promise.reject({errCode:400, errMsg: "Invalid input"})

  const authorExists = await getUserByUsernameModel(author)
  const topicExists = await db.query(`SELECT slug FROM topics WHERE slug=$1`, [topic])
  if(topicExists.rows.length < 1) return Promise.reject({errCode:404, errMsg: "Topic not found"})

  let dbQuery;
  let newArticle
  if (article_img_url) {
    dbQuery = `
      INSERT INTO articles (author, title, body, topic, article_img_url)
      VALUES ($1, $2, $3, $4, $5) RETURNING article_id`

      newArticle = await db.query(dbQuery, [author, title, body, topic, article_img_url])
  } else {
     dbQuery = `
      INSERT INTO articles (author, title, body, topic)
      VALUES ($1, $2, $3, $4) RETURNING article_id`
      newArticle = await db.query(dbQuery, [author, title, body, topic])
  }

  const article = await this.getArticleByIdModel(newArticle.rows[0].article_id)

  return article
};
