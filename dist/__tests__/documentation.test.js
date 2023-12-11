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
describe("documentation", () => {
    it("POST 200: Should return an object ", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.app).get("/api");
        expect(res.statusCode).toBe(200);
        const docs = res.body;
        for (const key in docs) {
            if (key !== "GET /api") {
                expect(docs[key]).toHaveProperty("description");
                expect(docs[key]).toHaveProperty("queries");
                expect(docs[key]).toHaveProperty("authorization");
                expect(docs[key]).toHaveProperty("exampleResponse");
                expect(Array.isArray(docs[key]["queries"])).toBe(true);
                expect(typeof docs[key]["exampleResponse"]).toBe("object");
            }
            else {
                expect(docs[key]).toHaveProperty("description");
                expect(docs[key]["description"]).toBe("serves up a json representation of all the available endpoints of the api");
            }
        }
    }));
});
