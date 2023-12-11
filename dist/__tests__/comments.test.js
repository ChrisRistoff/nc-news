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
const supertest_1 = __importDefault(require("supertest"));
const data = __importStar(require("../db/data/test-data/index"));
const seed_1 = require("../db/seeds/seed");
const app_1 = require("../app");
const connection_1 = __importDefault(require("../db/connection"));
let token;
let server;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, seed_1.seed)(data);
    const auth = yield (0, supertest_1.default)(app_1.app)
        .post("/api/users/signin")
        .send({ username: "test", password: "password" });
    token = auth.body.token;
    server = app_1.app.listen(0);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield server.close();
    yield connection_1.default.end();
}));
describe("get comments for article", () => {
    it("GET 200: Should return all comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles/1/comments");
        expect(res.statusCode).toBe(200);
        const comments = res.body.comments;
        for (const comment of comments) {
            expect(comment.article_id).toBe(1);
            expect(comment).toEqual(expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
            }));
        }
    }));
    it("GET 200: Should return an empty array when the article has no comments", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles/36/comments");
        expect(res.statusCode).toBe(200);
        expect(res.body.comments.length).toBe(0);
    }));
    it("GET 200: Should paginate results by default", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles/1/comments");
        expect(res.statusCode).toBe(200);
        const comments = res.body.comments;
        expect(comments.length).toBe(10);
        for (const comment of comments) {
            expect(comment.article_id).toBe(1);
            expect(comment).toEqual(expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
            }));
        }
    }));
    it("GET 200: Should paginate results by given params", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles/1/comments?p=2&limit=2");
        expect(res.statusCode).toBe(200);
        const comments = res.body.comments;
        expect(comments.length).toBe(2);
        for (const comment of comments) {
            expect(comment.article_id).toBe(1);
            expect(comment).toEqual(expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
            }));
        }
    }));
    it("GET 400: Should return an error when given invalid input for page", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles/1/comments?p=asd&limit=2");
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("GET 400: Should return an error when given invalid input for limit", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles/1/comments?p=1&limit=asd");
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("GET 404: Should return an error to the user when article is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles/231321/comments");
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("Article ID not found");
    }));
    it("GET 400: Should return an error to the user when article is not valid", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles/asdas/comments");
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
});
describe("update comment by ID", () => {
    it("PATCH 200: Should return an updated comment to the user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/comments/2")
            .send({ inc_votes: 100 });
        expect(res.statusCode).toBe(200);
        expect(res.body.newComment).toEqual(expect.objectContaining({
            body: expect.any(String),
            votes: 116,
            author: "test",
            article_id: 9,
            created_at: expect.any(String),
        }));
    }));
    it("PATCH 200: Should update the original comment", () => __awaiter(void 0, void 0, void 0, function* () {
        let article = yield (0, supertest_1.default)(app_1.app).get("/api/articles/1/comments");
        expect(article.statusCode).toBe(200);
        const initialVootes = article.body.comments[0].votes;
        const comment_id = article.body.comments[0].comment_id;
        yield (0, supertest_1.default)(app_1.app)
            .patch(`/api/comments/${comment_id}`)
            .send({ inc_votes: 100 })
            .expect(200);
        article = yield (0, supertest_1.default)(app_1.app).get("/api/articles/1/comments");
        expect(article.statusCode).toBe(200);
        const newVotes = article.body.comments[0].votes;
        expect(newVotes === initialVootes + 100).toBe(true);
    }));
    it("PATCH 404: Should return an error when comment is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/comments/1231")
            .send({ inc_votes: 100 });
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("Comment ID not found");
    }));
    it("PATCH 400: Should return an error when comment ID is not valid", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/comments/asda")
            .send({ inc_votes: 100 });
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("PATCH 400: Should return an error when inc_votes is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/comments/1")
            .send({ inc_votes: "asd" });
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("PATCH 400: Should return an error when inc_votes is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).patch("/api/comments/1");
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
});
