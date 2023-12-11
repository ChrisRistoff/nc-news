"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const ENV = process.env.NODE_ENV || "development";
let relativePath;
if (ENV === "production") {
    relativePath = `../../.env.${ENV}`;
}
else {
    relativePath = ENV === "test" ? `../.env.${ENV}` : `../../.env.${ENV}`;
}
const envPath = path_1.default.resolve(__dirname, relativePath);
// console.log(`Loading environment variables from: ${envPath}`);
dotenv_1.default.config({ path: envPath });
// console.log(`Environment: ${ENV}`);
// console.log(`PGDATABASE: ${process.env.PGDATABASE}`);
const config = {};
if (ENV === "production") {
    config.connectionString = process.env.DATABASE_URL;
    config.max = 2;
}
else {
    if (!process.env.PGDATABASE) {
        throw new Error("PGDATABASE not set");
    }
}
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error("PGDATABASE or DATABASE_URL not set");
}
exports.default = new pg_1.Pool(config);
