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
const topicsModels_1 = require("../models/topicsModels/topicsModels");
const protectedTopicsModels_1 = require("../models/topicsModels/protectedTopicsModels");
const getAllTopics = (_, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get all topics
        const topics = yield (0, topicsModels_1.getAllTopicsModel)();
        // send the topics
        res.status(200).send({ topics });
    }
    catch (error) {
        // handle the error
        next(error);
    }
});
exports.getAllTopics = getAllTopics;
const createTopic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get the slug and description from the request
    const { slug, description } = req.body;
    const creator = req.user.username;
    try {
        // create the topic
        const topic = yield (0, protectedTopicsModels_1.createTopicModel)(slug, description, creator);
        // send the topic object
        res.status(201).send({ topic });
    }
    catch (error) {
        // handle the error
        next(error);
    }
});
exports.createTopic = createTopic;
const getActiveUsersInTopic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // get the topic from the request
    const { topic } = req.params;
    try {
        // get the active users in the topic
        const users = yield (0, topicsModels_1.getActiveUsersInTopicModel)(topic);
        // send the users
        res.status(200).send({ users });
    }
    catch (error) {
        // handle the error
        next(error);
    }
});
exports.getActiveUsersInTopic = getActiveUsersInTopic;
