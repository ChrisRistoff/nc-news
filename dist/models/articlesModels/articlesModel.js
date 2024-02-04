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
exports.getArticleByIdModel = exports.getAllArticlesModel = void 0;
const connection_1 = __importDefault(require("../../db/connection"));
const paginate_1 = require("../../middleware/paginate");
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
const getAllArticlesModel = (topic, order, sort_by, p, limit, search) => __awaiter(void 0, void 0, void 0, function* () {
    let dbQuery;
    // format search string if it exists
    search = search ? `%${search}%` : null;
    const params = [];
    // create base query
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
    // add search and topic to query if they exist
    if (search) {
        dbQuery += `
    WHERE a.title ILIKE $1
    OR a.body ILIKE $1
    OR a.topic ILIKE $1
    OR a.author ILIKE $1`;
        params.push(search);
    }
    // add topic to query if it exists
    if (topic) {
        const checkTopic = yield connection_1.default.query(`SELECT slug FROM topics WHERE slug = $1`, [topic]);
        if (checkTopic.rows.length < 1)
            return Promise.reject({ errCode: 404, errMsg: "Topic not found" });
        dbQuery += search ? `AND topic = $2` : `WHERE topic = $1`;
        params.push(topic);
    }
    // add group by and order by to query
    dbQuery += `GROUP BY a.author, a.title, a.article_id, a.topic, a.created_at, a.votes, a.article_img_url`;
    // add sort by to query if exist
    if (sort_by) {
        if (!sortBy.has(sort_by))
            return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
        if (sort_by !== "comment_count")
            sort_by = "a." + sort_by;
    }
    else {
        sort_by = "a.created_at";
    }
    // add order to query if exists
    if (order) {
        if (!orders.includes(order))
            return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
    }
    else {
        order = "DESC";
    }
    dbQuery += `
    ORDER BY ${sort_by} ${order.toUpperCase()}
    `;
    // add pagination to query default to 1 if not provided
    dbQuery = (0, paginate_1.paginateQuery)(dbQuery, p, limit);
    if (!dbQuery)
        return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
    // execute query and store the results
    let articles;
    articles = yield connection_1.default.query(dbQuery, params);
    // total count query string
    let total_countQuery = `
    SELECT CAST(COUNT(article_id) AS INTEGER) as total_count FROM articles
  `;
    let total_count;
    // add search and topic to query if they exist
    total_countQuery += search ? `WHERE (title ILIKE $1 OR body ILIKE $1 OR topic ILIKE $1 OR author ILIKE $1)` : ``;
    total_countQuery += topic && search ? `AND topic = $2` : topic ? `WHERE topic = $1` : ``;
    const totalCountParams = search ? [search] : [];
    if (topic)
        totalCountParams.push(topic);
    // execute total count query and store the results
    total_count = yield connection_1.default.query(total_countQuery, totalCountParams);
    total_count = total_count.rows[0].total_count;
    // return the results
    return [articles.rows, total_count];
});
exports.getAllArticlesModel = getAllArticlesModel;
const getArticleByIdModel = (article_id) => __awaiter(void 0, void 0, void 0, function* () {
    // get article by id
    const article = yield connection_1.default.query(`
    SELECT
      a.*, CAST(COUNT(c.comment_id) AS INTEGER) AS comment_count
    FROM articles a
    LEFT JOIN comments c
    ON c.article_id = a.article_id
    WHERE a.article_id = $1
    GROUP BY a.article_id
  `, [article_id]);
    // if article is not found, return 404
    if (article.rows.length < 1)
        return Promise.reject({ errCode: 404, errMsg: "Article ID not found" });
    // return the article
    return article.rows[0];
});
exports.getArticleByIdModel = getArticleByIdModel;
