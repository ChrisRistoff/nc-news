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
exports.getActiveUsersInTopic = exports.createTopic = exports.getAllTopics = void 0;
const topicsModels_1 = require("../models/topicsModels");
const getAllTopics = (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const topics = yield (0, topicsModels_1.getAllTopicsModel)();
        res.status(200).send({ topics });
    }
    catch (error) {
        next(error);
    }
});
exports.getAllTopics = getAllTopics;
const createTopic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { slug, description } = req.body;
    const creator = req.user.username;
    try {
        const topic = yield (0, topicsModels_1.createTopicModel)(slug, description, creator);
        res.status(201).send({ topic });
    }
    catch (error) {
        next(error);
    }
});
exports.createTopic = createTopic;
const getActiveUsersInTopic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { topic } = req.params;
    try {
        const users = yield (0, topicsModels_1.getActiveUsersInTopicModel)(topic);
        res.status(200).send({ users });
    }
    catch (error) {
        next(error);
    }
});
exports.getActiveUsersInTopic = getActiveUsersInTopic;
