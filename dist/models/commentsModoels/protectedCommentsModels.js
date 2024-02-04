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
exports.editCommentByIdModel = exports.updateCommentByIdModel = exports.deleteCommentByIdModel = exports.createCommentForArticleModel = void 0;
const articlesModel_1 = require("../articlesModels/articlesModel");
const connection_1 = __importDefault(require("../../db/connection"));
const createCommentForArticleModel = (body, article_id, username) => __awaiter(void 0, void 0, void 0, function* () {
    // if body is empty, return 400
    if (!body)
        return Promise.reject({ errCode: 400, errMsg: "Body can not be empty" });
    // get the article by id if not found the model will throw a 404 error
    const article = yield (0, articlesModel_1.getArticleByIdModel)(article_id);
    // insert the comment into the database
    const comment = yield connection_1.default.query(`
    INSERT INTO comments (body, article_id, author)
    VALUES ($1, $2, $3) RETURNING *
  `, [body, article_id, username]);
    // return the comment object
    return comment.rows[0];
});
exports.createCommentForArticleModel = createCommentForArticleModel;
const deleteCommentByIdModel = (comment_id, username) => __awaiter(void 0, void 0, void 0, function* () {
    // get comment by id
    const comment = yield connection_1.default.query(`
    SELECT author FROM comments WHERE comment_id = $1
    `, [comment_id]);
    // if the comment is not found, return 404
    if (comment.rows.length < 1)
        return Promise.reject({ errCode: 404, errMsg: "Comment does not exist" });
    // if the comment does not belong to the user, return 401
    if (comment.rows[0].author !== username) {
        return Promise.reject({
            errCode: 401,
            errMsg: "Comment belongs to another user",
        });
    }
    // delete the comment from the database
    yield connection_1.default.query(`
  DELETE FROM comments WHERE comment_id = $1
  `, [comment_id]);
    return;
});
exports.deleteCommentByIdModel = deleteCommentByIdModel;
const updateCommentByIdModel = (comment_id, inc_votes) => __awaiter(void 0, void 0, void 0, function* () {
    // if inc_votes is not a number, return 400
    if (isNaN(+inc_votes)) {
        return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
    }
    // get the comment by id
    const comment = yield connection_1.default.query(`
    SELECT votes FROM comments WHERE comment_id = $1
  `, [comment_id]);
    // if the comment is not found, return 404
    if (comment.rows.length < 1)
        return Promise.reject({ errCode: 404, errMsg: "Comment ID not found" });
    // calculate the new votes
    const newVotes = comment.rows[0].votes + +inc_votes;
    // update the comment with the new votes
    const newComment = yield connection_1.default.query(`
    UPDATE comments
    SET votes = $2
    WHERE comment_id = $1
    RETURNING *
    `, [comment_id, newVotes]);
    // return the updated comment
    return newComment.rows[0];
});
exports.updateCommentByIdModel = updateCommentByIdModel;
const editCommentByIdModel = (comment_id, body, author) => __awaiter(void 0, void 0, void 0, function* () {
    // if body is empty, return 400
    if (!body) {
        return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
    }
    // get the comment by id
    const checkComment = yield connection_1.default.query(`
  SELECT author FROM comments where comment_id = $1
  `, [comment_id]);
    // if the comment is not found, return 404
    if (checkComment.rows.length < 1) {
        return Promise.reject({ errCode: 404, errMsg: "Comment ID not found" });
    }
    // if the comment does not belong to the user, return 401
    if (checkComment.rows[0].author !== author) {
        return Promise.reject({
            errCode: 401,
            errMsg: "Comment belongs to another user",
        });
    }
    // update the comment with the new body
    const comment = yield connection_1.default.query(`
  UPDATE comments
  SET body = $1
  WHERE comment_id = $2
  RETURNING *
  `, [body, comment_id]);
    // return the updated comment
    return comment.rows[0];
});
exports.editCommentByIdModel = editCommentByIdModel;
