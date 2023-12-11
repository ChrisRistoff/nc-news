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
exports.getActiveUsersInTopicModel = exports.createTopicModel = exports.getAllTopicsModel = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const getAllTopicsModel = () => __awaiter(void 0, void 0, void 0, function* () {
    const topics = yield connection_1.default.query(`
    SELECT * FROM topics;
  `);
    return topics.rows;
});
exports.getAllTopicsModel = getAllTopicsModel;
const createTopicModel = (slug, description, creator) => __awaiter(void 0, void 0, void 0, function* () {
    if (!slug || !description)
        return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
    const topic = yield connection_1.default.query(`
    INSERT INTO topics (creator, slug, description)
    VALUES ($3, $1, $2) RETURNING *
    `, [slug, description, creator]);
    return topic.rows[0];
});
exports.createTopicModel = createTopicModel;
const getActiveUsersInTopicModel = (topic) => __awaiter(void 0, void 0, void 0, function* () {
    const checkTopic = yield connection_1.default.query(`
  SELECT slug FROM topics WHERE slug = $1
  `, [topic]);
    if (checkTopic.rows.length < 1) {
        return Promise.reject({ errCode: 404, errMsg: "Topic not found" });
    }
    const users = yield connection_1.default.query(`
  SELECT u.username, u.name, u.avatar_url
  FROM articles a
  JOIN users u
  ON a.author = u.username
  WHERE a.topic = $1
  GROUP BY u.username
  `, [topic]);
    return users.rows;
});
exports.getActiveUsersInTopicModel = getActiveUsersInTopicModel;
