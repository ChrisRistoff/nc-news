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
exports.seed = void 0;
const pg_format_1 = __importDefault(require("pg-format"));
const authMiddleware_1 = require("../../middleware/authMiddleware");
const connection_1 = __importDefault(require("../connection"));
const utils_1 = require("./utils");
const seed = ({ topicData, userData, articleData, commentData, repliesData }) => __awaiter(void 0, void 0, void 0, function* () {
    yield connection_1.default.query(`DROP TABLE IF EXISTS replies;`);
    yield connection_1.default.query(`DROP TABLE IF EXISTS comments;`);
    yield connection_1.default.query(`DROP TABLE IF EXISTS articles;`);
    yield connection_1.default.query(`DROP TABLE IF EXISTS topics;`);
    yield connection_1.default.query(`DROP TABLE IF EXISTS users;`);
    yield connection_1.default.query(`
      CREATE TABLE users (
        username VARCHAR PRIMARY KEY,
        name VARCHAR NOT NULL,
        password VARCHAR NOT NULL,
        avatar_url VARCHAR DEFAULT 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'
      );`);
    yield connection_1.default.query(`
      CREATE TABLE topics (
        creator VARCHAR REFERENCES users(username),
        slug VARCHAR PRIMARY KEY,
        description VARCHAR
      );`);
    yield connection_1.default.query(`
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
    yield connection_1.default.query(`
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
    yield connection_1.default.query(`
      CREATE TABLE replies (
        reply_id SERIAL PRIMARY KEY,
        body VARCHAR NOT NULL,
        author VARCHAR,
        votes INT DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        comment_id INTEGER NOT NULL,
        FOREIGN KEY (comment_id) REFERENCES comments(comment_id) ON DELETE CASCADE
      );`);
    const hashedUserData = yield Promise.all(userData.map(({ username, name, password, avatar_url }) => __awaiter(void 0, void 0, void 0, function* () {
        const hashedPw = yield (0, authMiddleware_1.hashPassword)(password);
        return [username, name, hashedPw, avatar_url];
    })));
    const insertUsersQueryStr = (0, pg_format_1.default)("INSERT INTO users (username, name, password, avatar_url) VALUES %L;", hashedUserData);
    yield connection_1.default.query(insertUsersQueryStr);
    const insertTopicsQueryStr = (0, pg_format_1.default)("INSERT INTO topics (creator, slug, description) VALUES %L;", topicData.map(({ creator, slug, description }) => [
        creator,
        slug,
        description,
    ]));
    yield connection_1.default.query(insertTopicsQueryStr);
    const formattedArticleData = articleData.map(utils_1.convertTimestampToDate);
    const insertArticlesQueryStr = (0, pg_format_1.default)("INSERT INTO articles (title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;", formattedArticleData.map(({ title, topic, author, body, created_at, votes = 0, article_img_url, }) => [title, topic, author, body, created_at, votes, article_img_url]));
    const articleRows = yield connection_1.default.query(insertArticlesQueryStr);
    const articleIdLookup = (0, utils_1.createRef)(articleRows.rows, "title", "article_id");
    const formattedCommentData = (0, utils_1.formatComments)(commentData, articleIdLookup);
    const insertCommentsQueryStr = (0, pg_format_1.default)("INSERT INTO comments (body, author, article_id, votes, created_at) VALUES %L;", formattedCommentData.map(({ body, author, article_id, votes = 0, created_at }) => [
        body,
        author,
        article_id,
        votes,
        created_at,
    ]));
    yield connection_1.default.query(insertCommentsQueryStr);
    const formattedRepliesData = repliesData.map(utils_1.convertTimestampToDate);
    for (let reply of formattedRepliesData) {
        yield connection_1.default.query(`
      INSERT INTO replies (body, comment_id, author, votes, created_at)
      VALUES ($1, $2, $3, $4, $5)
    `, [reply.body, reply.comment_id, reply.author, reply.votes, reply.created_at]);
    }
    return;
});
exports.seed = seed;
