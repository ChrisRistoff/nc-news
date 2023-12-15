import { Query, QueryResult } from "pg";
import db from "../db/connection";
import { comparePassword } from "../middleware/authMiddleware";
import exp from "node:constants";

export const createUserModel = async (
  username: string,
  name: string,
  password: string,
  avatar_url: string,
) => {
  const existingUser: QueryResult = await db.query(
    `
  SELECT username FROM users WHERE username=$1
  `,
    [username],
  );

  if (existingUser.rows.length > 0) {
    return Promise.reject({ errCode: 409, errMsg: "User already exists" });
  }

  let user: QueryResult;
  if (avatar_url) {
    user = await db.query(
      `
    INSERT INTO users (username, name, password, avatar_url)
    VALUES ($1, $2, $3, $4) RETURNING *
    `,
      [username, name, password, avatar_url],
    );
  } else {
    user = await db.query(
      `
    INSERT INTO users (username, name, password)
    VALUES ($1, $2, $3) RETURNING *
    `,
      [username, name, password],
    );
  }

  return user.rows[0];
};

export const signUserInModel = async (username: string, password: string) => {
  const user: QueryResult = await db.query(
    `
    SELECT * FROM users WHERE username=$1
  `,
    [username],
  );

  if (!user.rows.length) {
    return Promise.reject({ errCode: 404, errMsg: "User not found" });
  }

  const isValid: boolean = await comparePassword(
    password,
    user.rows[0].password,
  );

  if (!isValid)
    return Promise.reject({ errCode: 401, errMsg: "Incorrect password" });

  delete user["password"];

  return user.rows[0];
};

export const getAllUsersModel = async () => {
  const users: QueryResult = await db.query(
    `
  SELECT * FROM users;
  `,
  );

  for (let i = 0; i < users.rows.length; i++) {
    delete users.rows[i].password;
  }

  return users.rows;
};

export const getUserByUsernameModel = async (username: string) => {
  const user: QueryResult = await db.query(
    `
    SELECT * FROM users WHERE username=$1
    `,
    [username],
  );

  if (user.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "User not found" });

  delete user.rows[0].password;

  return user.rows[0];
};

export const getUserArticlesModel = async (username: string) => {
  const user: QueryResult = await db.query(`
    SELECT username FROM users WHERE username=$1`, [username]);

  if (user.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "User not found" });

  const articles: QueryResult = await db.query(`
    SELECT * FROM articles WHERE author=$1`, [username],
  );

  return articles.rows;
}

export const getUserCommentsModel = async (username: string) => {
  const user: QueryResult = await db.query(`
    SELECT username FROM users WHERE username=$1`, [username]);

  if (user.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "User not found" });

  const comments: QueryResult = await db.query(`
    SELECT c.*, a.title as article_title, a.article_id FROM comments c
    JOIN articles a ON c.article_id = a.article_id
    WHERE c.author=$1
    ORDER BY c.created_at DESC
  `, [username]
  );

  return comments.rows;
}
