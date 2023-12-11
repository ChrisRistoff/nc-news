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
describe("create comments", () => {
    it("POST 201: Should create a new comment for an article", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/articles/1/comments")
            .send({
            body: "test body",
        })
            .set("Authorization", `Bearer ${token}`);
        const comment = res.body.comment;
        expect(res.statusCode).toBe(201);
        expect(comment.author).toBe("test");
        expect(comment.body).toBe("test body");
        expect(comment.article_id).toBe(1);
        expect(comment).toHaveProperty("comment_id");
    }));
    it("POST 201: Should create a new comment for an article when extra parameters in the body are given", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/articles/1/comments")
            .send({
            body: "test body",
            test: "testing",
        })
            .set("Authorization", `Bearer ${token}`);
        const comment = res.body.comment;
        expect(res.statusCode).toBe(201);
        expect(comment.author).toBe("test");
        expect(comment.body).toBe("test body");
        expect(comment.article_id).toBe(1);
        expect(comment).toHaveProperty("comment_id");
    }));
    it("POST 401: Should return an error when the user is not logged in", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).post("/api/articles/1/comments").send({
            body: "test body",
        });
        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe("You need to be logged in");
    }));
    it("POST 400: Should return an error when user gives invalid input for article ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/articles/asdsa/comments")
            .send({
            username: "butter_bridge",
            body: "test body",
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("POST 404: Should return an error article with ID does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/articles/12312312/comments")
            .send({
            username: "butter_bridge",
            body: "test body",
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("Article ID not found");
    }));
    it("POST 400: Should return an error when body is empty", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/articles/1/comments")
            .send({
            username: "butter_bridge",
            body: "",
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Body can not be empty");
    }));
    it("POST 400: Should return an error when body is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/articles/1/comments")
            .send({
            username: "butter_bridge",
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Body can not be empty");
    }));
});
describe("delete comment", () => {
    it("DELETE 204: Should delete comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .delete("/api/comments/1")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(204);
    }));
    it("DELETE 204: Comment should be deleted", () => __awaiter(void 0, void 0, void 0, function* () {
        const comments = yield (0, supertest_1.default)(app_1.app).get("/api/articles/1/comments");
        expect(comments.statusCode).toBe(200);
        const commentId = comments.body.comments[0].comment_id;
        const deleteComment = yield (0, supertest_1.default)(app_1.app)
            .delete(`/api/comments/${commentId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(deleteComment.statusCode).toBe(204);
        const updatedComments = yield (0, supertest_1.default)(app_1.app).get("/api/articles/1/comments");
        expect(updatedComments.statusCode).toBe(200);
        for (const comment of updatedComments.body.comments) {
            expect(comment.comment_id !== commentId).toBe(true);
        }
    }));
    it("DELETE 400: Should return an error when invalid commend ID is given", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .delete("/api/comments/asds")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("DELETE 404: Should return an error when article ID does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .delete("/api/comments/1200")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("Comment does not exist");
    }));
});
describe("edit comments", () => {
    it("PATCH 200: Should update a comment by comment ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/comments/2/edit")
            .send({
            body: "edited test body",
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        const comment = res.body.comment;
        expect(comment.author).toBe("test");
        expect(comment.body).toBe("edited test body");
        expect(comment.article_id).toBe(9);
        expect(comment).toHaveProperty("comment_id");
    }));
    it("PATCH 401: Should return an error when user is not signed in", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).patch("/api/comments/2/edit").send({
            body: "edited test body",
        });
        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe("You need to be logged in");
    }));
    it("PATCH 404: Should return an error comment ID is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/comments/1000/edit")
            .send({
            body: "edited test body",
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("Comment ID not found");
    }));
    it("PATCH 401: Should return an error when comment belongs to another user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/comments/10/edit")
            .send({
            body: "edited test body",
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe("Comment belongs to another user");
    }));
    it("PATCH 400: Should return an error when body is empty", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/comments/2/edit")
            .send({
            body: "",
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("PATCH 400: Should return an error when body is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/comments/2/edit")
            .send({})
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
});
