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
const commentsModel_1 = require("../models/commentsModel");
const createCommentForArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req.body;
    const { article_id } = req.params;
    const { username } = req.user;
    try {
        const comment = yield (0, commentsModel_1.createCommentForArticleModel)(body, article_id, username);
        res.status(201).send({ comment });
    }
    catch (error) {
        next(error);
    }
});
exports.createCommentForArticle = createCommentForArticle;
const getAllCommentsForArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { article_id } = req.params;
    const { p, limit } = req.query;
    try {
        const comments = yield (0, commentsModel_1.getAllCommentsForArticleModel)(article_id, p, limit);
        res.status(200).send({ comments: comments[0], total_count: comments[1] });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllCommentsForArticle = getAllCommentsForArticle;
const deleteCommentById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment_id } = req.params;
    const { username } = req.user;
    try {
        yield (0, commentsModel_1.deleteCommentByIdModel)(comment_id, username);
        res.status(204).send({});
    }
    catch (error) {
        next(error);
    }
});
exports.deleteCommentById = deleteCommentById;
const updateCommentById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    try {
        const newComment = yield (0, commentsModel_1.updateCommentByIdModel)(comment_id, inc_votes);
        res.status(200).send({ newComment });
    }
    catch (error) {
        next(error);
    }
});
exports.updateCommentById = updateCommentById;
const editCommentById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { comment_id } = req.params;
    const { body } = req.body;
    const { username } = req.user;
    try {
        const comment = yield (0, commentsModel_1.editCommentByIdModel)(comment_id, body, username);
        res.status(200).send({ comment });
    }
    catch (error) {
        next(error);
    }
});
exports.editCommentById = editCommentById;
