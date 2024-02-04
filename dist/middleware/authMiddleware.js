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
exports.protect = exports.createJWT = exports.comparePassword = exports.hashPassword = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, 10);
});
exports.hashPassword = hashPassword;
const comparePassword = (password, hashedPassword) => {
    return bcrypt_1.default.compare(password, hashedPassword);
};
exports.comparePassword = comparePassword;
const createJWT = (user) => {
    // get the secret from the environment
    const secret = process.env.JWT_SECRET;
    // create a jwt token
    const token = jsonwebtoken_1.default.sign({
        username: user.username,
    }, secret);
    // return the token
    return token;
};
exports.createJWT = createJWT;
const protect = (req, res, next) => {
    // get the token from the request headers
    const bearer = req.headers.authorization;
    // if the token is not found, return 401
    if (!bearer) {
        return res.status(401).send({ msg: "You need to be logged in" });
    }
    // split the token
    const split_token = bearer.split(" ");
    // get the token from the split
    const token = split_token[1];
    // if the token is not found, return 401
    if (!token) {
        return res.status(401).send({ msg: "Token is not valid" });
    }
    try {
        // get the secret from the environment
        const secret = process.env.JWT_SECRET;
        // verify the token
        const user = jsonwebtoken_1.default.verify(token, secret);
        // set the user on the request object
        req.user = user;
        // move to the next middleware
        next();
    }
    catch (error) {
        // if any error occurs, return 401
        return res.status(401).send({ msg: "Token is not valid" });
    }
};
exports.protect = protect;
