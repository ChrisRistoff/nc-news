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
exports.getDocsModel = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const getDocsModel = () => __awaiter(void 0, void 0, void 0, function* () {
    const ENV = process.env.NODE_ENV;
    let path;
    if (ENV === "test") {
        path = `${__dirname}/../endpoints.json`;
    }
    else {
        path = `${__dirname}/../../endpoints.json`;
    }
    const docs = yield promises_1.default.readFile(path, "utf-8");
    return JSON.parse(docs);
});
exports.getDocsModel = getDocsModel;
