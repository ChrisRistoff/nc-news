"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCommentsModel = exports.getUserArticlesModel = exports.getUserByUsernameModel = exports.getAllUsersModel = exports.signUserInModel = void 0;
const connection_1 = __importDefault(require("../../db/connection"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const signUserInModel = (username, password) => __awaiter(void 0, void 0, void 0, function* () {
    // get the user by username
    const user = yield connection_1.default.query(`
    SELECT * FROM users WHERE username=$1
  `, [username]);
    // if the user is not found, return 404
    if (!user.rows.length) {
        return Promise.reject({ errCode: 404, errMsg: "User not found" });
    }
    // compare the password
    const isValid = yield (0, authMiddleware_1.comparePassword)(password, user.rows[0].password);
    // if the password is incorrect, return 401
    if (!isValid)
        return Promise.reject({ errCode: 401, errMsg: "Incorrect password" });
    // delete the password from the user object
    delete user["password"];
    // return the user object
    return user.rows[0];
});
exports.signUserInModel = signUserInModel;
const getAllUsersModel = () => __awaiter(void 0, void 0, void 0, function* () {
    // get all users from the database
    const users = yield connection_1.default.query(`
  SELECT * FROM users;
  `);
    // delete the password from all the user objects
    for (let i = 0; i < users.rows.length; i++) {
        delete users.rows[i].password;
    }
    // return the users
    return users.rows;
});
exports.getAllUsersModel = getAllUsersModel;
const getUserByUsernameModel = (username) => __awaiter(void 0, void 0, void 0, function* () {
    // get the user by username
    const user = yield connection_1.default.query(`
    SELECT * FROM users WHERE username=$1
    `, [username]);
    // if the user is not found, return 404
    if (user.rows.length < 1)
        return Promise.reject({ errCode: 404, errMsg: "User not found" });
    // delete the password from the user object
    delete user.rows[0].password;
    // return the user object
    return user.rows[0];
});
exports.getUserByUsernameModel = getUserByUsernameModel;
const getUserArticlesModel = (username, p) => __awaiter(void 0, void 0, void 0, function* () {
    // set default limit and offset
    const limit = 5;
    const offset = (+p - 1) * limit;
    // get the user by username
    const user = yield connection_1.default.query(`
    SELECT username FROM users WHERE username=$1`, [username]);
    // if the user is not found, return 404
    if (user.rows.length < 1)
        return Promise.reject({ errCode: 404, errMsg: "User not found" });
    // get the articles by the user
    const articles = yield connection_1.default.query(`
    SELECT * FROM articles WHERE author=$1
    LIMIT 5 OFFSET $2
    `, [username, offset]);
    // get the total count of articles for the user
    const total_count = yield connection_1.default.query(`SELECT CAST(COUNT(article_id) AS INTEGER) as total_count FROM articles WHERE author = $1`, [username]);
    // return the articles and the total count
    return [articles.rows, total_count.rows[0].total_count];
});
exports.getUserArticlesModel = getUserArticlesModel;
const getUserCommentsModel = (username, p) => __awaiter(void 0, void 0, void 0, function* () {
    // set default limit and offset
    const limit = 5;
    const offset = (+p - 1) * limit;
    // get the user by username
    const user = yield connection_1.default.query(`
    SELECT username FROM users WHERE username=$1`, [username]);
    // if the user is not found, return 404
    if (user.rows.length < 1)
        return Promise.reject({ errCode: 404, errMsg: "User not found" });
    // get the comments by the user
    const comments = yield connection_1.default.query(`
    SELECT c.*, a.title as article_title, a.article_id FROM comments c
    JOIN articles a ON c.article_id = a.article_id
    WHERE c.author=$1
    ORDER BY c.created_at DESC
    LIMIT 5 OFFSET $2
  `, [username, offset]);
    // get the total count of comments for the user
    let total_count = yield connection_1.default.query(`SELECT CAST(COUNT(comment_id) AS INTEGER) as total_count FROM comments WHERE author = $1`, [username]);
    // return the comments and the total count
    return [comments.rows, total_count.rows[0].total_count];
});
exports.getUserCommentsModel = getUserCommentsModel;
