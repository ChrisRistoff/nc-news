import {QueryResult} from "pg";
import db from "../../db/connection";



export const createUserModel = async (
  username: string,
  name: string,
  password: string,
  avatar_url: string,
) => {

  // check if the user already exists
  const existingUser: QueryResult = await db.query(
    `
  SELECT username FROM users WHERE username=$1
  `,
    [username],
  );

  // if the user already exists, return 409
  if (existingUser.rows.length > 0) {
    return Promise.reject({ errCode: 409, errMsg: "User already exists" });
  }

  let user: QueryResult;

  // create the user with an avatar_url if it exists
  if (avatar_url) {
    user = await db.query(
      `
    INSERT INTO users (username, name, password, avatar_url)
    VALUES ($1, $2, $3, $4) RETURNING *
    `,
      [username, name, password, avatar_url],
    );

  // create the user with default avatar if no avatar_url
  } else {
    user = await db.query(
      `
    INSERT INTO users (username, name, password)
    VALUES ($1, $2, $3) RETURNING *
    `,
      [username, name, password],
    );
  }

  // return the user object
  return user.rows[0];
};
