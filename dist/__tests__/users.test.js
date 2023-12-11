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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("jest-sorted");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const connection_1 = __importDefault(require("../db/connection"));
let server;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    server = app_1.app.listen(0);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield server.close();
    yield connection_1.default.end();
}));
describe("get all users", () => {
    it("GET 200: Should return an array of all users to the user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/users");
        const users = res.body.users;
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(users)).toBe(true);
        expect(users.length > 0).toBe(true);
        for (const user of users) {
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("avatar_url");
        }
    }));
});
describe("get user by username", () => {
    it("GET 200: Should return an object with the user to the user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/users/rogersop");
        expect(res.statusCode).toBe(200);
        expect(res.body.user.username).toBe("rogersop");
        expect(res.body.user.name).toBe("paul");
        expect(res.body.user.avatar_url).toBe("https://avatars2.githubusercontent.com/u/24394918?s=400&v=4");
    }));
    it("GET 404: Should return an error when user is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api/users/asdasdasd");
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("User not found");
        expect(res.body.token).not.toBeDefined();
    }));
});
describe("create user", () => {
    it("POST 201: Should create a new user", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).post("/api/users/signup").send({
            username: "username",
            name: "name",
            password: "password",
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.token).toBeDefined();
    }));
    it("POST 409: Should return an error if user already exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).post("/api/users/signup").send({
            username: "test",
            name: "name",
            password: "password",
        });
        expect(res.statusCode).toBe(409);
        expect(res.body.msg).toBe("User already exists");
        expect(res.body.token).not.toBeDefined();
    }));
});
describe("sign in", () => {
    it("POST 200; Should return a token when a valid user signs in", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).post("/api/users/signin").send({
            username: "test",
            password: "password",
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    }));
    it("POST 404: Should return an error if the user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).post("/api/users/signin").send({
            username: "testerrrr",
            password: "password",
        });
        expect(res.statusCode).toBe(404);
        expect(res.body.msg).toBe("User not found");
        expect(res.body.token).not.toBeDefined();
    }));
    it("POST 409: Should return an error if the passwords do not match", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).post("/api/users/signin").send({
            username: "test",
            password: "passwordss",
        });
        expect(res.statusCode).toBe(401);
        expect(res.body.msg).toBe("Incorrect password");
        expect(res.body.token).not.toBeDefined();
    }));
});
