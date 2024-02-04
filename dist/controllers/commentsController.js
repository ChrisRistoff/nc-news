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
exports.editCommentById = exports.updateCommentById = exports.deleteCommentById = exports.getAllCommentsForArticle = exports.createCommentForArticle = void 0;
const protectedCommentsModels_1 = require("../models/commentsModoels/protectedCommentsModels");
const commentsModel_1 = require("../models/commentsModoels/commentsModel");
const createCommentForArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get the body, article_id and username from the request
    const { body } = req.body;
    const { article_id } = req.params;
    const { username } = req.user;
    try {
        // create a new comment for the article
        const comment = yield (0, protectedCommentsModels_1.createCommentForArticleModel)(body, article_id, username);
        // send the comment object
        res.status(201).send({ comment });
    }
    catch (error) {
        // handle the error
        next(error);
    }
});
exports.createCommentForArticle = createCommentForArticle;
const getAllCommentsForArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get the article_id, p and limit from the request
    const { article_id } = req.params;
    const { p, limit } = req.query;
    try {
        // get all the comments for the article
        const comments = yield (0, commentsModel_1.getAllCommentsForArticleModel)(article_id, p, limit);
        // send the comments array and the total count
        res.status(200).send({ comments: comments[0], total_count: comments[1] });
    }
    catch (error) {
        // handle the error
        next(error);
    }
});
exports.getAllCommentsForArticle = getAllCommentsForArticle;
const deleteCommentById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get the comment_id and username from the request
    const { comment_id } = req.params;
    const { username } = req.user;
    try {
        // delete the comment by id
        yield (0, protectedCommentsModels_1.deleteCommentByIdModel)(comment_id, username);
        // send 204 status
        res.status(204).send({});
    }
    catch (error) {
        // handle the error
        next(error);
    }
});
exports.deleteCommentById = deleteCommentById;
const updateCommentById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get the comment_id and inc_votes from the request
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    try {
        // update the comment by id
        const newComment = yield (0, protectedCommentsModels_1.updateCommentByIdModel)(comment_id, inc_votes);
        // send the new comment object
        res.status(200).send({ newComment });
    }
    catch (error) {
        // handle the error
        next(error);
    }
});
exports.updateCommentById = updateCommentById;
const editCommentById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get the comment_id, body and username from the request
    const { comment_id } = req.params;
    const { body } = req.body;
    const { username } = req.user;
    try {
        // edit the comment by id
        const comment = yield (0, protectedCommentsModels_1.editCommentByIdModel)(comment_id, body, username);
        // send the comment object
        res.status(200).send({ comment });
    }
    catch (error) {
        // handle the error
        next(error);
    }
});
exports.editCommentById = editCommentById;
