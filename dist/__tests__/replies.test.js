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
describe("get replies", () => {
    it("GET 200: Should return an array of replies for a comment", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/comments/1/replies");
        expect(res.statusCode).toBe(200);
        expect(res.body.replies.length).toBe(4);
        for (let reply of res.body.replies) {
            expect(reply.comment_id).toBe(1);
            expect(reply).toEqual(expect.objectContaining({
                reply_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
            }));
        }
    }));
    it("GET 404: Should return an error when comment is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/comments/21212/replies");
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("Comment not found");
    }));
    it("GET 400: Should return an error when comment ID is not valid", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/comments/asda/replies");
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
});
describe("update votes", () => {
    it("PATCH 200: Should update reply votes", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/replies/1")
            .send({ inc_votes: 100 });
        expect(res.statusCode).toBe(200);
        const reply = res.body.reply;
        expect(reply.reply_id).toBe(1);
        expect(reply.votes).toBe(102);
        expect(reply).toHaveProperty("body");
        expect(reply).toHaveProperty("author");
        expect(reply).toHaveProperty("created_at");
        expect(reply).toHaveProperty("comment_id");
    }));
    it("PATCH 404: Should return an error when reply does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/replies/1111")
            .send({ inc_votes: 100 });
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("Reply not found");
    }));
    it("PATCH 400: Should return an error when inc_votes is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/replies/1")
            .send({ inc_votes: "sada" });
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("PATCH 400: Should return an error when inc_votes is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/replies/1");
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("PATCH 400: Should return an error when reply ID is not valid", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .patch("/api/replies/asda");
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
});
