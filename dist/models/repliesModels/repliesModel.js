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
exports.updateReplyVoteModel = exports.editReplyBodyModel = exports.deleteReplyByIdModel = exports.createReplyModel = exports.getRepliesForCommentModel = void 0;
const connection_1 = __importDefault(require("../../db/connection"));
const getRepliesForCommentModel = (comment_id) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield connection_1.default.query(`
  SELECT comment_id FROM comments WHERE comment_id = $1
  `, [comment_id]);
    if (comment.rows.length < 1) {
        return Promise.reject({ errCode: 404, errMsg: "Comment not found" });
    }
    const replies = yield connection_1.default.query(`
  SELECT * FROM replies WHERE comment_id = $1
  `, [comment_id]);
    return replies.rows;
});
exports.getRepliesForCommentModel = getRepliesForCommentModel;
const createReplyModel = (comment_id, author, body) => __awaiter(void 0, void 0, void 0, function* () {
    if (!body)
        return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
    const comment = yield connection_1.default.query(`
  SELECT comment_id FROM comments WHERE comment_id=$1
  `, [comment_id]);
    if (comment.rows.length < 1) {
        return Promise.reject({ errCode: 404, errMsg: "Comment not found" });
    }
    const reply = yield connection_1.default.query(`
  INSERT INTO replies (body, author, comment_id)
  VALUES ($1, $2, $3) RETURNING *
  `, [body, author, comment_id]);
    return reply.rows[0];
});
exports.createReplyModel = createReplyModel;
const deleteReplyByIdModel = (reply_id, username) => __awaiter(void 0, void 0, void 0, function* () {
    const reply = yield connection_1.default.query(`
  SELECT author FROM replies WHERE reply_id=$1
  `, [reply_id]);
    if (reply.rows.length < 1) {
        return Promise.reject({ errCode: 404, errMsg: "Reply not found" });
    }
    if (reply.rows[0].author !== username) {
        return Promise.reject({
            errCode: 401,
            errMsg: "Reply belongs to another user",
        });
    }
    yield connection_1.default.query(`
  DELETE FROM replies WHERE reply_id=$1
  `, [reply_id]);
    return;
});
exports.deleteReplyByIdModel = deleteReplyByIdModel;
const editReplyBodyModel = (reply_id, author, body) => __awaiter(void 0, void 0, void 0, function* () {
    const reply = yield connection_1.default.query(`
  SELECT author FROM replies where reply_id = $1
  `, [reply_id]);
    if (reply.rows.length < 1) {
        return Promise.reject({ errCode: 404, errMsg: "Reply not found" });
    }
    if (reply.rows[0].author !== author) {
        return Promise.reject({ errCode: 401, errMsg: "Reply belongs to another user" });
    }
    const newReply = yield connection_1.default.query(`
  UPDATE replies
  SET body = $1
  WHERE reply_id = $2
  RETURNING *
  `, [body, reply_id]);
    return newReply.rows[0];
});
exports.editReplyBodyModel = editReplyBodyModel;
const updateReplyVoteModel = (reply_id, inc_votes) => __awaiter(void 0, void 0, void 0, function* () {
    if (isNaN(+inc_votes)) {
        return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
    }
    const reply = yield connection_1.default.query(`
    SELECT votes FROM replies WHERE reply_id = $1
  `, [reply_id]);
    if (reply.rows.length < 1)
        return Promise.reject({ errCode: 404, errMsg: "Reply not found" });
    const newVotes = reply.rows[0].votes + +inc_votes;
    const newReply = yield connection_1.default.query(`
    UPDATE replies
    SET votes = $2
    WHERE reply_id = $1
    RETURNING *
    `, [reply_id, newVotes]);
    return newReply.rows[0];
});
exports.updateReplyVoteModel = updateReplyVoteModel;
