import { Query, QueryResult } from "pg";
import db from "../../db/connection";
import { comparePassword } from "../../middleware/authMiddleware";
import exp from "node:constants";



export const signUserInModel = async (username: string, password: string) => {

  // get the user by username
  const user: QueryResult = await db.query(
    `
    SELECT * FROM users WHERE username=$1
  `,
    [username],
  );

  // if the user is not found, return 404
  if (!user.rows.length) {
    return Promise.reject({ errCode: 404, errMsg: "User not found" });
  }

  // compare the password
  const isValid: boolean = await comparePassword(
    password,
    user.rows[0].password,
  );

  // if the password is incorrect, return 401
  if (!isValid)
    return Promise.reject({ errCode: 401, errMsg: "Incorrect password" });

  // delete the password from the user object
  delete user["password"];

  // return the user object
  return user.rows[0];
};



export const getAllUsersModel = async () => {

  // get all users from the database
  const users: QueryResult = await db.query(
    `
  SELECT * FROM users;
  `,
  );

  // delete the password from all the user objects
  for (let i = 0; i < users.rows.length; i++) {
    delete users.rows[i].password;
  }

  // return the users
  return users.rows;
};



export const getUserByUsernameModel = async (username: string) => {

  // get the user by username
  const user: QueryResult = await db.query(
    `
    SELECT * FROM users WHERE username=$1
    `,
    [username],
  );

  // if the user is not found, return 404
  if (user.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "User not found" });

  // delete the password from the user object
  delete user.rows[0].password;

  // return the user object
  return user.rows[0];
};



export const getUserArticlesModel = async (username: string, p: string) => {

  // set default limit and offset
  const limit: number = 5;
  const offset: number = (+p - 1) * limit;

  // get the user by username
  const user: QueryResult = await db.query(`
    SELECT username FROM users WHERE username=$1`, [username]);

  // if the user is not found, return 404
  if (user.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "User not found" });

  // get the articles by the user
  const articles: QueryResult = await db.query(`
    SELECT * FROM articles WHERE author=$1
    LIMIT 5 OFFSET $2
    `, [username, offset],
  );

  // get the total count of articles for the user
  const total_count: QueryResult = await db.query(
    `SELECT CAST(COUNT(article_id) AS INTEGER) as total_count FROM articles WHERE author = $1`
    , [username])

  // return the articles and the total count
  return [articles.rows, total_count.rows[0].total_count];
}



export const getUserCommentsModel = async (username: string, p: string ) => {

  // set default limit and offset
  const limit: number = 5;
  const offset: number = (+p - 1) * limit;

  // get the user by username
  const user: QueryResult = await db.query(`
    SELECT username FROM users WHERE username=$1`, [username]);

  // if the user is not found, return 404
  if (user.rows.length < 1)
    return Promise.reject({ errCode: 404, errMsg: "User not found" });

  // get the comments by the user
  const comments: QueryResult = await db.query(`
    SELECT c.*, a.title as article_title, a.article_id FROM comments c
    JOIN articles a ON c.article_id = a.article_id
    WHERE c.author=$1
    ORDER BY c.created_at DESC
    LIMIT 5 OFFSET $2
  `, [username, offset]
  );

  // get the total count of comments for the user
  let total_count: QueryResult = await db.query(
    `SELECT CAST(COUNT(comment_id) AS INTEGER) as total_count FROM comments WHERE author = $1`
    , [username])

  // return the comments and the total count
  return [comments.rows, total_count.rows[0].total_count];
}
