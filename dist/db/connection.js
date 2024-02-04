"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// get the environment from the environment variables or default to development
const ENV = process.env.NODE_ENV || "development";
// if the environment is production, use the DATABASE_URL
let relativePath;
if (ENV === "production") {
    relativePath = `../../.env.${ENV}`;
}
else {
    relativePath = ENV === "test" ? `../.env.${ENV}` : `../../.env.${ENV}`;
}
// get the path to the environment file
const envPath = path_1.default.resolve(__dirname, relativePath);
// configure the environment variables
dotenv_1.default.config({ path: envPath });
// create the configuration object
const config = {};
// if the environment is production, use the DATABASE_URL
if (ENV === "production") {
    config.connectionString = process.env.DATABASE_URL;
    config.max = 2;
    // if the environment is not production, use the environment variables
}
else {
    if (!process.env.PGDATABASE) {
        throw new Error("PGDATABASE not set");
    }
}
// create the pool
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
    throw new Error("PGDATABASE or DATABASE_URL not set");
}
exports.default = new pg_1.Pool(config);
