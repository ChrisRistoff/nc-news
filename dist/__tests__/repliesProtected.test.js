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
describe("create replies", () => {
    it("POST 201: Should create a new reply for a comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/comments/1/replies")
            .send({
            body: "test body",
        })
            .set("Authorization", `Bearer ${token}`);
        const reply = res.body.reply;
        expect(res.statusCode).toBe(201);
        expect(reply.author).toBe("test");
        expect(reply.body).toBe("test body");
        expect(reply.comment_id).toBe(1);
        expect(reply).toHaveProperty("reply_id");
    }));
    it("POST 401: Should return an error when user is not signed in", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).post("/api/comments/1/replies").send({
            body: "test body",
        });
        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe("You need to be logged in");
    }));
    it("POST 404: Should return an error when comment_id is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/comments/1111/replies")
            .send({
            body: "test body",
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("Comment not found");
    }));
    it("POST 400: Should return an error when comment_id is not valid", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/comments/sdasdas/replies")
            .send({
            body: "test body",
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("POST 400: Should return an error when body is empty", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/comments/1/replies")
            .send({
            body: "",
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("POST 400: Should return an error when body is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/comments/1/replies")
            .send({})
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
});
describe("delete reply", () => {
    it("DELETE 204: Should delete reply", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .delete("/api/replies/1")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(204);
        const replies = yield (0, supertest_1.default)(app_1.app)
            .get("/api/comments/1/replies")
            .set("Authorization", `Bearer ${token}`);
        for (const reply of replies.body.replies) {
            expect(reply.reply_id).not.toBe(1);
        }
    }));
    it("DELETE 401: Should return an error when user is not signed in", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).delete("/api/replies/1");
        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe("You need to be logged in");
    }));
    it("DELETE 401: Should return an error when reply belongs to another user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .delete("/api/replies/12")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe("Reply belongs to another user");
    }));
    it("DELETE 404: Should return an error when reply is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .delete("/api/replies/12212")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("Reply not found");
    }));
    it("DELETE 400: Should return an error when reply ID is not valid", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .delete("/api/replies/sads")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
});
describe("edit reply body", () => {
    it("PATCH 200: Should update reply's body", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/replies/2/edit")
            .send({
            body: "asdasdasd",
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        const reply = res.body.reply;
        expect(reply.author).toBe("test");
        expect(reply.reply_id).toBe(2);
        expect(reply.body).toBe("asdasdasd");
    }));
    it("PATCH 401: Should return an error when user is not signed in", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).patch("/api/replies/2/edit").send({
            body: "asdasdas",
        });
        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe("You need to be logged in");
    }));
    it("PATCH 401: Should return an error when user is not the author", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/replies/6/edit")
            .send({
            body: "asdasdas",
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe("Reply belongs to another user");
    }));
    it("PATCH 404: Should return an error when reply is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/replies/6212/edit")
            .send({
            body: "asdasdas",
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("Reply not found");
    }));
    it("PATCH 400: Should return an error when reply is not valid", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/replies/sda/edit")
            .send({
            body: "asdasdas",
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("PATCH 400: Should return an error when body is empty", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/replies/sda/edit")
            .send({
            body: "",
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("PATCH 400: Should return an error when body is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/replies/sda/edit")
            .send({})
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
});
