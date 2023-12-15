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
exports.updateArticleBodyModel = exports.deleteArticleModel = exports.createArticleModel = exports.updateArticleByIdModel = exports.getArticleByIdModel = exports.getAllArticlesModel = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const paginate_1 = require("../middleware/paginate");
const usersModel_1 = require("./usersModel");
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
const getAllArticlesModel = (topic, order, sort_by, p, limit) => __awaiter(void 0, void 0, void 0, function* () {
    let dbQuery;
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
        const checkTopic = yield connection_1.default.query(`SELECT slug FROM topics WHERE slug = $1`, [topic]);
        if (checkTopic.rows.length < 1)
            return Promise.reject({ errCode: 404, errMsg: "Topic not found" });
        dbQuery += `WHERE topic = $1`;
    }
    if (sort_by) {
        if (!sortBy.has(sort_by))
            return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
        if (sort_by !== "comment_count")
            sort_by = "a." + sort_by;
    }
    else {
        sort_by = "a.created_at";
    }
    if (order) {
        if (!orders.includes(order))
            return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
    }
    else {
        order = "DESC";
    }
    dbQuery += `
    GROUP BY a.article_id
    ORDER BY ${sort_by} ${order.toUpperCase()}
    `;
    dbQuery = (0, paginate_1.paginateQuery)(dbQuery, p, limit);
    if (!dbQuery)
        return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
    let articles;
    if (topic)
        articles = yield connection_1.default.query(dbQuery, [topic]);
    else
        articles = yield connection_1.default.query(dbQuery);
    let total_countQuery = `
    SELECT CAST(COUNT(article_id) AS INTEGER) as total_count FROM articles
  `;
    let total_count;
    if (topic) {
        total_countQuery += `WHERE topic = $1`;
        total_count = yield connection_1.default.query(total_countQuery, [topic]);
    }
    else {
        total_count = yield connection_1.default.query(total_countQuery);
    }
    total_count = total_count.rows[0].total_count;
    return [articles.rows, total_count];
});
exports.getAllArticlesModel = getAllArticlesModel;
const getArticleByIdModel = (article_id) => __awaiter(void 0, void 0, void 0, function* () {
    const article = yield connection_1.default.query(`
    SELECT
      a.*, CAST(COUNT(c.comment_id) AS INTEGER) AS comment_count
    FROM articles a
    LEFT JOIN comments c
    ON c.article_id = a.article_id
    WHERE a.article_id = $1
    GROUP BY a.article_id
  `, [article_id]);
    if (article.rows.length < 1)
        return Promise.reject({ errCode: 404, errMsg: "Article ID not found" });
    return article.rows[0];
});
exports.getArticleByIdModel = getArticleByIdModel;
const updateArticleByIdModel = (article_id, inc_votes) => __awaiter(void 0, void 0, void 0, function* () {
    if (isNaN(+inc_votes)) {
        return Promise.reject({
            errCode: 400,
            errMsg: "Invalid input for increment votes",
        });
    }
    const article = yield (0, exports.getArticleByIdModel)(article_id);
    if (!article.article_id)
        return Promise.reject({ errCode: 404, errMsg: "Article ID not found" });
    const newVotes = article.votes + +inc_votes;
    const newArticle = yield connection_1.default.query(`
    UPDATE articles
    SET votes = $2
    WHERE article_id = $1
    RETURNING *
    `, [article_id, newVotes]);
    return newArticle.rows[0];
});
exports.updateArticleByIdModel = updateArticleByIdModel;
const createArticleModel = (author, title, body, topic, article_img_url) => __awaiter(void 0, void 0, void 0, function* () {
    if (!title || !body)
        return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
    yield (0, usersModel_1.getUserByUsernameModel)(author);
    const topicExists = yield connection_1.default.query(`SELECT slug FROM topics WHERE slug=$1`, [topic]);
    if (topicExists.rows.length < 1)
        return Promise.reject({ errCode: 404, errMsg: "Topic not found" });
    let dbQuery;
    let newArticle;
    if (article_img_url) {
        dbQuery = `
      INSERT INTO articles (author, title, body, topic, article_img_url)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        newArticle = yield connection_1.default.query(dbQuery, [
            author,
            title,
            body,
            topic,
            article_img_url,
        ]);
    }
    else {
        dbQuery = `
      INSERT INTO articles (author, title, body, topic)
      VALUES ($1, $2, $3, $4) RETURNING *`;
        newArticle = yield connection_1.default.query(dbQuery, [author, title, body, topic]);
    }
    newArticle.rows[0].comment_count = 0;
    return newArticle.rows[0];
});
exports.createArticleModel = createArticleModel;
const deleteArticleModel = (article_id, username) => __awaiter(void 0, void 0, void 0, function* () {
    const checkArticle = yield connection_1.default.query(`
  SELECT author FROM articles WHERE article_id = $1
  `, [article_id]);
    if (checkArticle.rows.length < 1)
        return Promise.reject({ errCode: 404, errMsg: "Article not found" });
    if (checkArticle.rows[0].author !== username) {
        return Promise.reject({
            errCode: 401,
            errMsg: "Article belongs to another user",
        });
    }
    yield connection_1.default.query(`
    DELETE FROM articles WHERE article_id = $1 RETURNING *
  `, [article_id]);
    return;
});
exports.deleteArticleModel = deleteArticleModel;
const updateArticleBodyModel = (article_id, username, body) => __awaiter(void 0, void 0, void 0, function* () {
    if (!body)
        return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
    const checkArticle = yield (0, exports.getArticleByIdModel)(article_id);
    if (checkArticle.length < 1) {
        return Promise.reject({ errCode: 404, errMsg: "Article not found" });
    }
    if (checkArticle.author !== username) {
        return Promise.reject({
            errCode: 401,
            errMsg: "Article belongs to another user",
        });
    }
    const article = yield connection_1.default.query(`
  UPDATE articles
  SET body = $1
  WHERE article_id = $2
  RETURNING *
  `, [body, article_id]);
    article.rows[0].comment_count = checkArticle.comment_count;
    return article.rows[0];
});
exports.updateArticleBodyModel = updateArticleBodyModel;
