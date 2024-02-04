import db from "../../db/connection"
import {QueryResult} from "pg";
import {getArticleByIdModel} from "./articlesModel";
import {getUserByUsernameModel} from "../usersModels/usersModel";




export const updateArticleByIdModel = async (
  article_id: string,
  inc_votes: number,
) => {

  // if inc_votes is not a number, return 400
  if (isNaN(+inc_votes)) {
    return Promise.reject({
      errCode: 400,
      errMsg: "Invalid input for increment votes",
    });
  }

  // get the article by id
  const article = await getArticleByIdModel(article_id);

  // if article is not found, return 404
  if (!article.article_id)
    return Promise.reject({ errCode: 404, errMsg: "Article ID not found" });

  // update the votes in the article object
  const newVotes = article.votes + +inc_votes;

  // update the votes in the database
  const newArticle: QueryResult = await db.query(
    `
    UPDATE articles
    SET votes = $2
    WHERE article_id = $1
    RETURNING *
    `,
    [article_id, newVotes],
  );

  // return the updated article
  return newArticle.rows[0];
};



export const createArticleModel = async (
  author: string,
  title: string,
  body: string,
  topic: string,
  article_img_url: string,
) => {

  // if any of the required fields are missing, return 400
  if (!title || !body)
    return Promise.reject({ errCode: 400, errMsg: "Invalid input" });

  // check if the author exists if not the model will throw a 404 error
  await getUserByUsernameModel(author);

  // check if the topic exists
  const topicExists: QueryResult = await db.query(
    `SELECT slug FROM topics WHERE slug=$1`,
    [topic],
  );

  // if the topic does not exist, return 404
  if (topicExists.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "Topic not found" });

  let dbQuery: string | boolean;
  let newArticle: QueryResult;

  // if there is an article_img_url, insert it into the database
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

  // if there is no article_img_url, insert the article with default image
  } else {
    dbQuery = `
      INSERT INTO articles (author, title, body, topic)
      VALUES ($1, $2, $3, $4) RETURNING *`;
    newArticle = await db.query(dbQuery, [author, title, body, topic]);
  }

  // add the comment count to the article object
  newArticle.rows[0].comment_count = 0;

  // return the new article
  return newArticle.rows[0];
};



export const deleteArticleModel = async (
  article_id: string,
  username: string,
) => {

  // get the article by id
  const checkArticle: QueryResult = await db.query(
    `
  SELECT author FROM articles WHERE article_id = $1
  `,
    [article_id],
  );

  // if the article is not found, return 404
  if (checkArticle.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "Article not found" });

  // if the article belongs to another user, return 401
  if (checkArticle.rows[0].author !== username) {
    return Promise.reject({
      errCode: 401,
      errMsg: "Article belongs to another user",
    });
  }

  // delete the article from the database
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

  // if the body is missing, return 400
  if (!body) return Promise.reject({ errCode: 400, errMsg: "Invalid input" });

  // get the article by id if not found the model will throw a 404 error
  const checkArticle = await getArticleByIdModel(article_id);

  // if the article belongs to another user, return 401
  if (checkArticle.author !== username) {
    return Promise.reject({
      errCode: 401,
      errMsg: "Article belongs to another user",
    });
  }

  // update the body in the database
  const article: QueryResult = await db.query(
    `
  UPDATE articles
  SET body = $1
  WHERE article_id = $2
  RETURNING *
  `,
    [body, article_id],
  );

  // update the comment count in the article object from the checkArticle object
  article.rows[0].comment_count = checkArticle.comment_count;

  // return the updated article
  return article.rows[0];
};

