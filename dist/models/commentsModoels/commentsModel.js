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
exports.getAllCommentsForArticleModel = void 0;
const connection_1 = __importDefault(require("../../db/connection"));
const paginate_1 = require("../../middleware/paginate");
const articlesModel_1 = require("../articlesModels/articlesModel");
const getAllCommentsForArticleModel = (article_id, p, limit) => __awaiter(void 0, void 0, void 0, function* () {
    // get the article by id if not found the model will throw a 404 error
    const article = yield (0, articlesModel_1.getArticleByIdModel)(article_id);
    let dbQuery;
    // create the query string
    dbQuery = `
    SELECT *
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
  `;
    // paginate the query
    dbQuery = (0, paginate_1.paginateQuery)(dbQuery, p, limit);
    // if the query is invalid, return 400
    if (!dbQuery)
        return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
    // get the comments from the database
    const comments = yield connection_1.default.query(dbQuery, [article_id]);
    // get the total count of comments for the article
    let total_count = yield connection_1.default.query(`SELECT CAST(COUNT(comment_id) AS INTEGER) as total_count FROM comments WHERE article_id = $1`, [article_id]);
    // update the total count
    total_count = total_count.rows[0].total_count;
    // return the comments and the total count
    return [comments.rows, total_count];
});
exports.getAllCommentsForArticleModel = getAllCommentsForArticleModel;
