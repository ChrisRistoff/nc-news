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
exports.getUserComments = exports.getUserArticles = exports.getUserByUsername = exports.getAllUsers = exports.signUserIn = exports.createUser = void 0;
const authMiddleware_1 = require("../middleware/authMiddleware");
const usersModel_1 = require("../models/usersModels/usersModel");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, username, password, avatar_url } = req.body;
    const hashedPw = yield (0, authMiddleware_1.hashPassword)(password);
    try {
        const user = yield (0, usersModel_1.createUserModel)(username, name, hashedPw, avatar_url);
        const token = (0, authMiddleware_1.createJWT)(user);
        req.user = { username: user.username };
        res.status(201).send({ token });
    }
    catch (error) {
        next(error);
    }
});
exports.createUser = createUser;
const signUserIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield (0, usersModel_1.signUserInModel)(username, password);
        const token = (0, authMiddleware_1.createJWT)(user);
        res.status(200).send({ token });
    }
    catch (error) {
        next(error);
    }
});
exports.signUserIn = signUserIn;
const getAllUsers = (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (0, usersModel_1.getAllUsersModel)();
        res.status(200).send({ users });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllUsers = getAllUsers;
const getUserByUsername = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    try {
        const user = yield (0, usersModel_1.getUserByUsernameModel)(username);
        res.status(200).send({ user });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserByUsername = getUserByUsername;
const getUserArticles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    let p;
    ({ p } = req.query);
    try {
        const data = yield (0, usersModel_1.getUserArticlesModel)(username, p);
        res.status(200).send({ articles: data[0], total_count: data[1] });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserArticles = getUserArticles;
const getUserComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    let p;
    ({ p } = req.query);
    try {
        const data = yield (0, usersModel_1.getUserCommentsModel)(username, p);
        res.status(200).send({ comments: data[0], total_count: data[1] });
    }
    catch (error) {
        next(error);
    }
});
exports.getUserComments = getUserComments;
