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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReplyVote = exports.editReplyBody = exports.deleteReplyById = exports.createReply = exports.getAllRepliesForComment = void 0;
const repliesModel_1 = require("../models/repliesModel");
const getAllRepliesForComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment_id } = req.params;
    try {
        const replies = yield (0, repliesModel_1.getRepliesForCommentModel)(comment_id);
        res.status(200).send({ replies });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllRepliesForComment = getAllRepliesForComment;
const createReply = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment_id } = req.params;
    const { username } = req.user;
    const { body } = req.body;
    try {
        const reply = yield (0, repliesModel_1.createReplyModel)(comment_id, username, body);
        res.status(201).send({ reply });
    }
    catch (error) {
        next(error);
    }
});
exports.createReply = createReply;
const deleteReplyById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.user;
    const { reply_id } = req.params;
    try {
        yield (0, repliesModel_1.deleteReplyByIdModel)(reply_id, username);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.deleteReplyById = deleteReplyById;
const editReplyBody = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { reply_id } = req.params;
    const { username } = req.user;
    const { body } = req.body;
    try {
        const reply = yield (0, repliesModel_1.editReplyBodyModel)(reply_id, username, body);
        res.status(200).send({ reply });
    }
    catch (error) {
        next(error);
    }
});
exports.editReplyBody = editReplyBody;
const updateReplyVote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { inc_votes } = req.body;
    const { reply_id } = req.params;
    try {
        const reply = yield (0, repliesModel_1.updateReplyVoteModel)(reply_id, inc_votes);
        res.status(200).send({ reply });
    }
    catch (error) {
        next(error);
    }
});
exports.updateReplyVote = updateReplyVote;
