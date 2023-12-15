import format from "pg-format";
import { hashPassword } from "../../middleware/authMiddleware";
import db from "../connection";
import { convertTimestampToDate, createRef, formatComments } from "./utils";

export const seed = async ({
  topicData,
  userData,
  articleData,
  commentData,
  repliesData
}) => {
  await db.query(`DROP TABLE IF EXISTS replies;`);
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS articles;`);
  await db.query(`DROP TABLE IF EXISTS topics;`);
  await db.query(`DROP TABLE IF EXISTS users;`);

  await db.query(`
      CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        password VARCHAR NOT NULL,
        avatar_url VARCHAR DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'
      );`);

  await db.query(`
      CREATE TABLE topics (
        creator VARCHAR REFERENCES users(username),
        slug VARCHAR PRIMARY KEY,
        description VARCHAR
      );`);

  await db.query(`
      CREATE TABLE articles (
        article_id SERIAL PRIMARY KEY,
        title VARCHAR NOT NULL,
        topic VARCHAR NOT NULL REFERENCES topics(slug),
        author VARCHAR NOT NULL REFERENCES users(username),
        body VARCHAR NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        votes INT DEFAULT 0 NOT NULL,
        article_img_url VARCHAR DEFAULT 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700'
      );`);

  await db.query(`
      CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        body VARCHAR NOT NULL,
        article_id INT NOT NULL,
        author VARCHAR NOT NULL,
        votes INT DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        FOREIGN KEY (author) REFERENCES users(username),
        FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE
      );`);

  await db.query(`
      CREATE TABLE replies (
        reply_id SERIAL PRIMARY KEY,
        body VARCHAR NOT NULL,
        author VARCHAR,
        votes INT DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        comment_id INTEGER NOT NULL,
        FOREIGN KEY (comment_id) REFERENCES comments(comment_id) ON DELETE CASCADE
      );`);

  const hashedUserData = await Promise.all(
    userData.map(async ({ username, name, password, avatar_url }) => {
      const hashedPw = await hashPassword(password);
      return [username, name, hashedPw, avatar_url];
    }),
  );

  const insertUsersQueryStr = format(
    "INSERT INTO users (username, name, password, avatar_url) VALUES %L;",
    hashedUserData,
  );

  await db.query(insertUsersQueryStr);

  const insertTopicsQueryStr = format(
    "INSERT INTO topics (creator, slug, description) VALUES %L;",
    topicData.map(({ creator, slug, description }) => [
      creator,
      slug,
      description,
    ]),
  );
  await db.query(insertTopicsQueryStr);

  const formattedArticleData = articleData.map(convertTimestampToDate);
  const insertArticlesQueryStr = format(
    "INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;",
    formattedArticleData.map(
      ({
        title,
        topic,
        author,
        body,
        created_at,
        votes = 0,
        article_img_url,
      }) => [title, topic, author, body, created_at, votes, article_img_url],
    ),
  );

  const articleRows = await db.query(insertArticlesQueryStr);
  const articleIdLookup = createRef(articleRows.rows, "title", "article_id");
  const formattedCommentData = formatComments(commentData, articleIdLookup);

  const insertCommentsQueryStr = format(
    "INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L;",
    formattedCommentData.map(
      ({ body, author, article_id, votes = 0, created_at }) => [
        body,
        author,
        article_id,
        votes,
        created_at,
      ],
    ),
  );
  await db.query(insertCommentsQueryStr);

  const formattedRepliesData = repliesData.map(convertTimestampToDate)

  for(let reply of formattedRepliesData) {
    await db.query(`
      INSERT INTO replies (body, comment_id, author, votes, created_at)
      VALUES ($1, $2, $3, $4, $5)
    `, [reply.body, reply.comment_id, reply.author, reply.votes, reply.created_at ])
  }

  return
};
