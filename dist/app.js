"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const topic = __importStar(require("./routers/topicsRouter"));
const articles = __importStar(require("./routers/articlesRouter"));
const comments = __importStar(require("./routers/commentsRouter"));
const replies = __importStar(require("./routers/repliesRouter"));
const usersRouter_1 = require("./routers/usersRouter");
const errorHandlers_1 = require("./middleware/errorHandlers");
const docController_1 = require("./documentation/docController");
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const cors_1 = __importDefault(require("cors"));
exports.app = (0, express_1.default)();
// use cors
exports.app.use((0, cors_1.default)());
// set up swagger
const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "NC news API",
            version: "1.0.0",
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{
                bearerAuth: [],
            }],
    },
    apis: ["./dist/routers/*.js"],
};
// initialize swagger-jsdoc
const openApiSpecs = (0, swagger_jsdoc_1.default)(options);
// use express.json
exports.app.use(express_1.default.json());
//docs
exports.app.get("/api", docController_1.getDocs);
//use swagger-ui
exports.app.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openApiSpecs));
//topics
exports.app.use("/api", topic.topicRouter);
exports.app.use("/api", topic.protectedTopicRouter);
//articles
exports.app.use("/api", articles.articleRouter);
exports.app.use("/api", articles.protectedArticleRouter);
//comments
exports.app.use("/api", comments.commentsRouter);
exports.app.use("/api", comments.protectedCommentsRouter);
//replies
exports.app.use("/api", replies.repliesRouter);
exports.app.use("/api", replies.protectedRepliesRouter);
//users
exports.app.use("/api", usersRouter_1.usersRouter);
//error handling
exports.app.use(errorHandlers_1.sqlErrors, errorHandlers_1.customErrors, errorHandlers_1.serverError);
