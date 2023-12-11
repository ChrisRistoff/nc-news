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
require("jest-sorted");
const supertest_1 = __importDefault(require("supertest"));
const data = __importStar(require("../db/data/test-data/index"));
const seed_1 = require("../db/seeds/seed");
const app_1 = require("../app");
const connection_1 = __importDefault(require("../db/connection"));
let server;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, seed_1.seed)(data);
    server = app_1.app.listen(0);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield server.close();
    yield connection_1.default.end();
}));
describe("get all articles", () => {
    it("GET 200: Should return an array of objects containing articles to the user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.articles)).toBe(true);
        expect(res.body.articles).toBeSortedBy("created_at", { descending: true });
        for (const article of res.body.articles) {
            expect(article).toEqual(expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number),
            }));
        }
    }));
    it("GET 200: Should return all articles if given a topic as a query", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles?topic=cats");
        expect(res.statusCode).toBe(200);
        const articles = res.body.articles;
        for (const article of articles) {
            expect(article).toEqual(expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: "cats",
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number),
            }));
        }
    }));
    it("GET 200: Should return an empty array if given a valid topic that has no articles", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles?topic=empty_test");
        expect(res.statusCode).toBe(200);
        expect(res.body.articles.length).toBe(0);
    }));
    it("GET 200: Should return articles sorted by parameter in the query", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles?sort_by=topic");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.articles)).toBe(true);
        expect(res.body.articles).toBeSortedBy("topic", { descending: true });
        for (const article of res.body.articles) {
            expect(article).toEqual(expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number),
            }));
        }
    }));
    it("GET 200: Should return articles sorted by parameter and order in the query", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles?sort_by=topic&order=asc");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.articles)).toBe(true);
        expect(res.body.articles).toBeSortedBy("topic", { descending: false });
        for (const article of res.body.articles) {
            expect(article).toEqual(expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number),
            }));
        }
    }));
    it("GET 200: Should return articles sorted and filtered by parameter and order in the query", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles?sort_by=comment_count&order=asc&topic=mitch");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.articles)).toBe(true);
        expect(res.body.articles).toBeSortedBy("topic", { descending: false });
        for (const article of res.body.articles) {
            expect(article).toEqual(expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number),
            }));
        }
    }));
    it("GET 200: Should return articles paginated by default", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.articles)).toBe(true);
        expect(res.body.articles.length).toBe(10);
        expect(res.body.total_count).toBe(38);
        for (const article of res.body.articles) {
            expect(article).toEqual(expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number),
            }));
        }
    }));
    it("GET 200: Should return articles paginated by query params", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles?p=2&limit=6&sort_by=article_id&order=asc");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.articles)).toBe(true);
        expect(res.body.articles.length).toBe(6);
        expect(res.body.articles[0].article_id).toBe(7);
        expect(res.body.articles[5].article_id).toBe(12);
        expect(res.body.total_count).toBe(38);
        for (const article of res.body.articles) {
            expect(article).toEqual(expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(Number),
            }));
        }
    }));
    it("GET 200: Should return an error if page is not a valid input", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles?p=asds&limit=6");
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("GET 200: Should return an error if limit is not a valid input", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles?p=2&limit=asd");
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("GET 400: Should return an error if sort_by value does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles?sort_by=;DELETE FROM topics;");
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("GET 400: Should return an error if order value does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles?order=;DELETE FROM topics;");
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("GET 404: Should return an error if topic does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles?topic=;DELETE FROM topics;");
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("Topic not found");
    }));
});
describe("get article by ID", () => {
    it("GET 200: Return an article to the user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles/1");
        const article = res.body.article;
        expect(res.statusCode).toBe(200);
        expect(article).toEqual(expect.objectContaining({
            article_id: 1,
            author: expect.any(String),
            title: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: 11,
        }));
    }));
    it("GET 404: Return an error to the user when an article is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles/12000");
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("Article ID not found");
    }));
    it("GET 400: Return an error to the user when invalid article ID is given", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/articles/asdas");
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
});
describe("update article", () => {
    it("PATCH 201: Should return updated article object to the user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/articles/1")
            .send({ inc_votes: 100 });
        expect(res.statusCode).toBe(200);
        expect(res.body.newArticle.article_id).toBe(1);
        expect(res.body.newArticle).toEqual(expect.objectContaining({
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
        }));
    }));
    it("PATCH 201: Should return updated article object to the user when given extra parameters in the body", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/articles/1")
            .send({ inc_votes: 100, test_param: "test" });
        expect(res.statusCode).toBe(200);
        expect(res.body.newArticle.article_id).toBe(1);
        expect(res.body.newArticle).toEqual(expect.objectContaining({
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
        }));
    }));
    it("PATCH, GET 200: Should update the votes in the article", () => __awaiter(void 0, void 0, void 0, function* () {
        const getArticle = yield (0, supertest_1.default)(app_1.app).get("/api/articles/1");
        expect(getArticle.statusCode).toBe(200);
        const votes = getArticle.body.article.votes;
        const inc_votes = 100;
        const updateArticle = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/articles/1")
            .send({ inc_votes });
        expect(updateArticle.statusCode).toBe(200);
        const updatedArticle = yield (0, supertest_1.default)(app_1.app).get("/api/articles/1");
        expect(updatedArticle.statusCode).toBe(200);
        const updatedVotes = updatedArticle.body.article.votes;
        expect(updatedVotes === votes + inc_votes).toBe(true);
    }));
    it("PATCH 404: should return an error when article id is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/articles/1000")
            .send({ inc_votes: 100 });
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("Article ID not found");
    }));
    it("PATCH 400: should return an error when an invalid article id is given", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/articles/asdas")
            .send({ inc_votes: 100 });
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("PATCH 400: should return an error when an invalid inc_votes is given", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/articles/1")
            .send({ inc_votes: "asdas" });
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input for increment votes");
    }));
});
