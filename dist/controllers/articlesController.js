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
exports.editArticleBody = exports.deleteArticle = exports.createArticle = exports.updateArticleById = exports.getArticleById = exports.getAllArticles = void 0;
const articlesModel_1 = require("../models/articlesModel");
const getAllArticles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { topic, order, sort_by, p, limit } = req.query;
    try {
        const result = yield (0, articlesModel_1.getAllArticlesModel)(topic, order, sort_by, p, limit);
        res.status(200).send({ articles: result[0], total_count: result[1] });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllArticles = getAllArticles;
const getArticleById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { article_id } = req.params;
    try {
        const article = yield (0, articlesModel_1.getArticleByIdModel)(article_id);
        res.status(200).send({ article });
    }
    catch (error) {
        next(error);
    }
});
exports.getArticleById = getArticleById;
const updateArticleById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { inc_votes } = req.body;
    const { article_id } = req.params;
    try {
        const newArticle = yield (0, articlesModel_1.updateArticleByIdModel)(article_id, inc_votes);
        res.status(200).send({ newArticle });
    }
    catch (error) {
        next(error);
    }
});
exports.updateArticleById = updateArticleById;
const createArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, body, topic, article_img_url } = req.body;
    const author = req.user.username;
    try {
        const article = yield (0, articlesModel_1.createArticleModel)(author, title, body, topic, article_img_url);
        res.status(201).send({ article });
    }
    catch (error) {
        next(error);
    }
});
exports.createArticle = createArticle;
const deleteArticle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { article_id } = req.params;
    const username = req.user.username;
    try {
        yield (0, articlesModel_1.deleteArticleModel)(article_id, username);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.deleteArticle = deleteArticle;
const editArticleBody = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { article_id } = req.params;
        const { body } = req.body;
        const { username } = req.user;
        const article = yield (0, articlesModel_1.updateArticleBodyModel)(article_id, username, body);
        res.status(200).send({ article });
    }
    catch (error) {
        next(error);
    }
});
exports.editArticleBody = editArticleBody;
