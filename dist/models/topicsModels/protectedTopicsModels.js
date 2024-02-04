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
exports.createTopicModel = void 0;
const connection_1 = __importDefault(require("../../db/connection"));
const createTopicModel = (slug, description, creator) => __awaiter(void 0, void 0, void 0, function* () {
    // if the slug or description is missing, return 400
    if (!slug || !description)
        return Promise.reject({ errCode: 400, errMsg: "Invalid input" });
    // create the topic in the database
    const topic = yield connection_1.default.query(`
    INSERT INTO topics (creator, slug, description)
    VALUES ($3, $1, $2) RETURNING *
    `, [slug, description, creator]);
    // return the topic object
    return topic.rows[0];
});
exports.createTopicModel = createTopicModel;
