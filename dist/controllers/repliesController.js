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
const repliesModel_1 = require("../models/repliesModels/repliesModel");
const protectedRepliesModel_1 = require("../models/repliesModels/protectedRepliesModel");
const getAllRepliesForComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get the comment_id from the request
    const { comment_id } = req.params;
    try {
        // get the replies for the comment
        const replies = yield (0, repliesModel_1.getRepliesForCommentModel)(comment_id);
        // send the replies
        res.status(200).send({ replies });
    }
    catch (error) {
        // handle the error
        next(error);
    }
});
exports.getAllRepliesForComment = getAllRepliesForComment;
const createReply = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get the comment_id, username and body from the request
    const { comment_id } = req.params;
    const { username } = req.user;
    const { body } = req.body;
    try {
        // create the reply
        const reply = yield (0, protectedRepliesModel_1.createReplyModel)(comment_id, username, body);
        // send the reply object
        res.status(201).send({ reply });
    }
    catch (error) {
        // handle the error
        next(error);
    }
});
exports.createReply = createReply;
const deleteReplyById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get the username and reply_id from the request
    const { username } = req.user;
    const { reply_id } = req.params;
    try {
        // delete the reply by id
        yield (0, protectedRepliesModel_1.deleteReplyByIdModel)(reply_id, username);
        // send 204 status
        res.status(204).send();
    }
    catch (error) {
        // handle the error
        next(error);
    }
});
exports.deleteReplyById = deleteReplyById;
const editReplyBody = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get the reply_id, username and body from the request
    const { reply_id } = req.params;
    const { username } = req.user;
    const { body } = req.body;
    try {
        // edit the reply body
        const reply = yield (0, protectedRepliesModel_1.editReplyBodyModel)(reply_id, username, body);
        // send the reply object
        res.status(200).send({ reply });
    }
    catch (error) {
        // handle the error
        next(error);
    }
});
exports.editReplyBody = editReplyBody;
const updateReplyVote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get the inc_votes and reply_id from the request
    const { inc_votes } = req.body;
    const { reply_id } = req.params;
    try {
        // update the reply vote
        const reply = yield (0, protectedRepliesModel_1.updateReplyVoteModel)(reply_id, inc_votes);
        // send the reply object
        res.status(200).send({ reply });
    }
    catch (error) {
        // handle the error
        next(error);
    }
});
exports.updateReplyVote = updateReplyVote;
