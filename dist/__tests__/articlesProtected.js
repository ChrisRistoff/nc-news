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
describe("create article", () => {
    it("POST 201: Should create a new article and return it to the user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/articles")
            .set("Authorization", `Bearer ${token}`)
            .send({
            title: "test article",
            body: "test article body",
            topic: "test",
            article_img_url: "test image",
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.article).toEqual(expect.objectContaining({
            article_id: 39,
            author: "test",
            votes: 0,
            created_at: expect.any(String),
            topic: "test",
            title: "test article",
            body: "test article body",
            article_img_url: "test image",
            comment_count: 0,
        }));
    }));
    it("POST 201: Should create a new article when img_url is empty and return it to the user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/articles")
            .set("Authorization", `Bearer ${token}`)
            .send({
            title: "test article2",
            body: "test article body",
            topic: "test",
            article_img_url: "",
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.article).toEqual(expect.objectContaining({
            article_id: 40,
            votes: 0,
            author: "test",
            created_at: expect.any(String),
            topic: "test",
            title: "test article2",
            body: "test article body",
            article_img_url: "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
            comment_count: 0,
        }));
    }));
    it("POST 401: Should return an error when user is not authorised", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).post("/api/articles").send({
            title: "test article",
            body: "test article body",
            topic: "test",
            article_img_url: "",
        });
        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe("You need to be logged in");
    }));
    it("POST 404: Should return an error when title is empty", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/articles")
            .set("Authorization", `Bearer ${token}`)
            .send({
            title: "",
            body: "test article body",
            topic: "test",
            article_img_url: "",
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("POST 404: Should return an error when title is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/articles")
            .set("Authorization", `Bearer ${token}`)
            .send({
            author: "rogersop",
            body: "test article body",
            topic: "test",
            article_img_url: "",
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("POST 404: Should return an error when body is empty", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/articles")
            .set("Authorization", `Bearer ${token}`)
            .send({
            author: "rogersop",
            title: "test",
            body: "",
            topic: "test",
            article_img_url: "",
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("POST 404: Should return an error when body is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/articles")
            .set("Authorization", `Bearer ${token}`)
            .send({
            author: "rogersop",
            title: "test",
            topic: "test",
            article_img_url: "",
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("POST 404: Should return an error when topic does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/articles")
            .set("Authorization", `Bearer ${token}`)
            .send({
            author: "rogersop",
            title: "test",
            body: "test",
            topic: "randomTopic",
            article_img_url: "",
        });
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("Topic not found");
    }));
    it("POST 404: Should return an error when topic is empty", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/articles")
            .set("Authorization", `Bearer ${token}`)
            .send({
            author: "rogersop",
            title: "test",
            body: "test",
            topic: "",
            article_img_url: "",
        });
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("Topic not found");
    }));
    it("POST 404: Should return an error when topic is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/articles")
            .set("Authorization", `Bearer ${token}`)
            .send({
            author: "rogersop",
            title: "test",
            body: "test",
            article_img_url: "",
        });
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("Topic not found");
    }));
});
describe("delete article", () => {
    it("DELETE 204: Should delete the article", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .delete("/api/articles/1")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(204);
        const checkArticle = yield (0, supertest_1.default)(app_1.app).get("/api/articles/1");
        expect(checkArticle.statusCode).toBe(404);
        expect(checkArticle.body.msg).toBe("Article ID not found");
        const checkComments = yield (0, supertest_1.default)(app_1.app).get("/api/articles/1/comments");
        expect(checkComments.statusCode).toBe(404);
        expect(checkComments.body.msg).toBe("Article ID not found");
        const deleteAgain = yield (0, supertest_1.default)(app_1.app)
            .delete("/api/articles/1")
            .set("Authorization", `Bearer ${token}`);
        expect(deleteAgain.statusCode).toBe(404);
        expect(deleteAgain.body.msg).toBe("Article not found");
    }));
    it("DELETE 404: Return an error when article does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .delete("/api/articles/2123")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("Article not found");
    }));
    it("DELETE 400: Return an error when article ID is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .delete("/api/articles/asd")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
});
describe("edit article body", () => {
    it("PATCH 200: Should update article body and return the updated article", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/articles/2/edit")
            .set("Authorization", `Bearer ${token}`)
            .send({
            body: "new test body",
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.article).toEqual(expect.objectContaining({
            article_id: 2,
            votes: 100,
            author: "test",
            created_at: expect.any(String),
            topic: "test",
            title: "test article2",
            body: "new test body",
            article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
            comment_count: 0,
        }));
    }));
    it("PATCH 401: Should return an error when user is not signed in", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).patch("/api/articles/2/edit").send({
            body: "new test body",
        });
        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe("You need to be logged in");
    }));
    it("PATCH 404: Should return an error article can not be found", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/articles/100/edit")
            .set("Authorization", `Bearer ${token}`)
            .send({
            body: "new test body",
        });
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("Article ID not found");
    }));
    it("PATCH 400: Should return an error when body is empty", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/articles/2/edit")
            .set("Authorization", `Bearer ${token}`)
            .send({
            body: "",
        });
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("PATCH 400: Should return an error when body is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/articles/1/edit")
            .set("Authorization", `Bearer ${token}`)
            .send({});
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("PATCH 400: Should return an error when article ID is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/articles/asda/edit")
            .set("Authorization", `Bearer ${token}`)
            .send({});
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("PATCH 400: Should return an error when article belongs to another user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/articles/4/edit")
            .set("Authorization", `Bearer ${token}`)
            .send({
            body: "test body",
        });
        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe("Article belongs to another user");
    }));
});
