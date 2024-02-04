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
exports.getActiveUsersInTopicModel = exports.getAllTopicsModel = void 0;
const connection_1 = __importDefault(require("../../db/connection"));
const getAllTopicsModel = () => __awaiter(void 0, void 0, void 0, function* () {
    // get all topics
    const topics = yield connection_1.default.query(`
    SELECT
        t.*,
        CAST(COUNT(a.article_id) AS INTEGER) AS article_count
    FROM topics t
    JOIN articles a
    ON t.slug = a.topic
    GROUP BY t.slug
  `);
    // return the topics
    return topics.rows;
});
exports.getAllTopicsModel = getAllTopicsModel;
const getActiveUsersInTopicModel = (topic) => __awaiter(void 0, void 0, void 0, function* () {
    // check if the topic exists
    const checkTopic = yield connection_1.default.query(`
  SELECT slug FROM topics WHERE slug = $1
  `, [topic]);
    // if the topic does not exist, return 404
    if (checkTopic.rows.length < 1) {
        return Promise.reject({ errCode: 404, errMsg: "Topic not found" });
    }
    // get the active users in the topic
    const users = yield connection_1.default.query(`
  SELECT u.username, u.name, u.avatar_url
  FROM articles a
  JOIN users u
  ON a.author = u.username
  WHERE a.topic = $1
  GROUP BY u.username
  `, [topic]);
    // return the users
    return users.rows;
});
exports.getActiveUsersInTopicModel = getActiveUsersInTopicModel;
