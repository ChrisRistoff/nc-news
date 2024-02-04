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
exports.editCommentByIdModel = exports.updateCommentByIdModel = exports.deleteCommentByIdModel = exports.getAllCommentsForArticleModel = exports.createCommentForArticleModel = void 0;
const connection_1 = __importDefault(require("../../db/connection"));
const paginate_1 = require("../../middleware/paginate");
const articlesModel_1 = require("../articlesModels/articlesModel");
const createCommentForArticleModel = (body, article_id, username) => __awaiter(void 0, void 0, void 0, function* () {
    if (!body)
        return Promise.reject({ errCode: 400, errMsg: "Body can not be empty" });
    const article = yield (0, articlesModel_1.getArticleByIdModel)(article_id);
    if (article.length < 1)
        return Promise.reject({ errCode: 404, errMsg: "Article ID not found" });
    const comment = yield connection_1.default.query(`
    INSERT INTO comments (body, article_id, author)
    VALUES ($1, $2, $3) RETURNING *
  `, [body, article_id, username]);
    return comment.rows[0];
});
exports.createCommentForArticleModel = createCommentForArticleModel;
const getAllCommentsForArticleModel = (article_id, p, limit) => __awaiter(void 0, void 0, void 0, function* () {
    const article = yield (0, articlesModel_1.getArticleByIdModel)(article_id);
    if (article.length < 1)
        return Promise.reject({ errCode: 404, errMsg: "Article ID not found" });
    let dbQuery;
    dbQuery = `
    SELECT *
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
  `;
    dbQuery = (0, paginate_1.paginateQuery)(dbQuery, p, limit);
    if (!dbQuery)
        return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
    const comments = yield connection_1.default.query(dbQuery, [article_id]);
    let total_count = yield connection_1.default.query(`SELECT CAST(COUNT(comment_id) AS INTEGER) as total_count FROM comments WHERE article_id = $1`, [article_id]);
    total_count = total_count.rows[0].total_count;
    return [comments.rows, total_count];
});
exports.getAllCommentsForArticleModel = getAllCommentsForArticleModel;
const deleteCommentByIdModel = (comment_id, username) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield connection_1.default.query(`
    SELECT author FROM comments WHERE comment_id = $1
    `, [comment_id]);
    if (comment.rows.length < 1)
        return Promise.reject({ errCode: 404, errMsg: "Comment does not exist" });
    if (comment.rows[0].author !== username) {
        return Promise.reject({
            errCode: 401,
            errMsg: "Comment belongs to another user",
        });
    }
    return connection_1.default.query(`
  DELETE FROM comments WHERE comment_id = $1
  `, [comment_id]);
});
exports.deleteCommentByIdModel = deleteCommentByIdModel;
const updateCommentByIdModel = (comment_id, inc_votes) => __awaiter(void 0, void 0, void 0, function* () {
    if (isNaN(+inc_votes)) {
        return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
    }
    const comment = yield connection_1.default.query(`
    SELECT votes FROM comments WHERE comment_id = $1
  `, [comment_id]);
    if (comment.rows.length < 1)
        return Promise.reject({ errCode: 404, errMsg: "Comment ID not found" });
    const newVotes = comment.rows[0].votes + +inc_votes;
    const newComment = yield connection_1.default.query(`
    UPDATE comments
    SET votes = $2
    WHERE comment_id = $1
    RETURNING *
    `, [comment_id, newVotes]);
    return newComment.rows[0];
});
exports.updateCommentByIdModel = updateCommentByIdModel;
const editCommentByIdModel = (comment_id, body, author) => __awaiter(void 0, void 0, void 0, function* () {
    if (!body) {
        return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
    }
    const checkComment = yield connection_1.default.query(`
  SELECT author FROM comments where comment_id = $1
  `, [comment_id]);
    if (checkComment.rows.length < 1) {
        return Promise.reject({ errCode: 404, errMsg: "Comment ID not found" });
    }
    if (checkComment.rows[0].author !== author) {
        return Promise.reject({
            errCode: 401,
            errMsg: "Comment belongs to another user",
        });
    }
    const comment = yield connection_1.default.query(`
  UPDATE comments
  SET body = $1
  WHERE comment_id = $2
  RETURNING *
  `, [body, comment_id]);
    return comment.rows[0];
});
exports.editCommentByIdModel = editCommentByIdModel;
