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
describe("topics", () => {
    it("GET 200: Should return an array of topic objects to the user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/topics");
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.topics)).toBe(true);
        for (const topic of res.body.topics) {
            expect(topic).toHaveProperty("slug");
            expect(topic).toHaveProperty("description");
        }
    }));
});
describe("create topic", () => {
    it("POST 201: Should create a new topic and return the object to the user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/topics")
            .send({
            slug: "testt",
            description: "testing",
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(201);
        expect(res.body.topic.slug).toBe("testt");
        expect(res.body.topic.description).toBe("testing");
    }));
    it("POST 201: Should create a new topic and return the object to the user when extra parameters in the body are given", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/topics")
            .send({
            slug: "testtt",
            description: "testing",
            test: "test",
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(201);
        expect(res.body.topic.slug).toBe("testtt");
        expect(res.body.topic.description).toBe("testing");
    }));
    it("POST 409: Should return an error if topic already exists", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/topics")
            .send({
            slug: "test",
            description: "testing",
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(409);
        expect(res.body.msg).toBe("Already exists");
    }));
    it("POST 400: Should return an error if slug is empty", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/topics")
            .send({
            slug: "",
            description: "testing",
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("POST 400: Should return an error if slug is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/topics")
            .send({
            description: "testing",
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("POST 400: Should return an error if body is empty", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/topics")
            .send({
            slug: "testt",
            description: "",
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
    it("POST 400: Should return an error if body is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app)
            .post("/api/topics")
            .send({
            slug: "testt",
        })
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe("Invalid input");
    }));
});
describe("get all active users in a topic", () => {
    it("GET 200: Should return all active users in a topic", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/topics/mitch/users");
        expect(res.statusCode).toBe(200);
        expect(res.body.users.length).toBe(3);
        for (const user of res.body.users) {
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("avatar_url");
        }
    }));
    it("GET 200: Should return an empty array", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/topics/empty_test/users");
        expect(res.statusCode).toBe(200);
        expect(res.body.users.length).toBe(0);
    }));
    it("GET 404: Should return an error if topic does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/topics/asdasd/users");
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("Topic not found");
    }));
});
