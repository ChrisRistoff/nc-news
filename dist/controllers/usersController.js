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
const protectedUserModel_1 = require("../models/usersModels/protectedUserModel");
const usersModel_1 = require("../models/usersModels/usersModel");
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get the user data from the request body
    const { name, username, password, avatar_url } = req.body;
    // hash the password
    const hashedPw = yield (0, authMiddleware_1.hashPassword)(password);
    try {
        // create the user
        const user = yield (0, protectedUserModel_1.createUserModel)(username, name, hashedPw, avatar_url);
        // create a jwt token
        const token = (0, authMiddleware_1.createJWT)(user);
        // set the user in the request object
        req.user = { username: user.username };
        // send the token
        res.status(201).send({ token });
    }
    catch (error) {
        // handle the error
        next(error);
    }
});
exports.createUser = createUser;
const signUserIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get the username and password from the request body
    const { username, password } = req.body;
    try {
        // sign the user in
        const user = yield (0, usersModel_1.signUserInModel)(username, password);
        // create a jwt token
        const token = (0, authMiddleware_1.createJWT)(user);
        // send the token
        res.status(200).send({ token });
    }
    catch (error) {
        // handle the error
        next(error);
    }
});
exports.signUserIn = signUserIn;
const getAllUsers = (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get all users
        const users = yield (0, usersModel_1.getAllUsersModel)();
        // send the users
        res.status(200).send({ users });
    }
    catch (error) {
        // handle the error
        next(error);
    }
});
exports.getAllUsers = getAllUsers;
const getUserByUsername = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get the username from the request parameters
    const { username } = req.params;
    try {
        // get the user by username
        const user = yield (0, usersModel_1.getUserByUsernameModel)(username);
        // send the user
        res.status(200).send({ user });
    }
    catch (error) {
        // handle the error
        next(error);
    }
});
exports.getUserByUsername = getUserByUsername;
const getUserArticles = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get the username from the request parameters
    const { username } = req.params;
    // get the page number from the query
    let p;
    ({ p } = req.query);
    try {
        // get the user's articles
        const data = yield (0, usersModel_1.getUserArticlesModel)(username, p);
        // send the articles
        res.status(200).send({ articles: data[0], total_count: data[1] });
    }
    catch (error) {
        // handle the error
        next(error);
    }
});
exports.getUserArticles = getUserArticles;
const getUserComments = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get the username from the request parameters
    const { username } = req.params;
    // get the page number from the query
    let p;
    ({ p } = req.query);
    try {
        // get the user's comments
        const data = yield (0, usersModel_1.getUserCommentsModel)(username, p);
        // send the comments
        res.status(200).send({ comments: data[0], total_count: data[1] });
    }
    catch (error) {
        // handle the error
        next(error);
    }
});
exports.getUserComments = getUserComments;
