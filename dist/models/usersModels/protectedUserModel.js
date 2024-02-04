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
exports.createUserModel = void 0;
const connection_1 = __importDefault(require("../../db/connection"));
const createUserModel = (username, name, password, avatar_url) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the user already exists
    const existingUser = yield connection_1.default.query(`
  SELECT username FROM users WHERE username=$1
  `, [username]);
    // if the user already exists, return 409
    if (existingUser.rows.length > 0) {
        return Promise.reject({ errCode: 409, errMsg: "User already exists" });
    }
    let user;
    // create the user with an avatar_url if it exists
    if (avatar_url) {
        user = yield connection_1.default.query(`
    INSERT INTO users (username, name, password, avatar_url)
    VALUES ($1, $2, $3, $4) RETURNING *
    `, [username, name, password, avatar_url]);
        // create the user with default avatar if no avatar_url
    }
    else {
        user = yield connection_1.default.query(`
    INSERT INTO users (username, name, password)
    VALUES ($1, $2, $3) RETURNING *
    `, [username, name, password]);
    }
    // return the user object
    return user.rows[0];
});
exports.createUserModel = createUserModel;
