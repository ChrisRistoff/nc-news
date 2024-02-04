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
exports.getRepliesForCommentModel = void 0;
const connection_1 = __importDefault(require("../../db/connection"));
const getRepliesForCommentModel = (comment_id) => __awaiter(void 0, void 0, void 0, function* () {
    // get the comment by id
    const comment = yield connection_1.default.query(`
  SELECT comment_id FROM comments WHERE comment_id = $1
  `, [comment_id]);
    // if the comment is not found, return 404
    if (comment.rows.length < 1) {
        return Promise.reject({ errCode: 404, errMsg: "Comment not found" });
    }
    // get the replies for the comment
    const replies = yield connection_1.default.query(`
  SELECT * FROM replies WHERE comment_id = $1
  `, [comment_id]);
    // return the replies
    return replies.rows;
});
exports.getRepliesForCommentModel = getRepliesForCommentModel;
