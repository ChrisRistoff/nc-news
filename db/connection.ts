import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";



// get the environment from the environment variables or default to development
const ENV = process.env.NODE_ENV || "development";

// if the environment is production, use the DATABASE_URL
let relativePath: string;
if (ENV === "production") {
  relativePath = `../../.env.${ENV}`;
} else {
  relativePath = ENV === "test" ? `../.env.${ENV}` : `../../.env.${ENV}`;
}

// get the path to the environment file
const envPath = path.resolve(__dirname, relativePath);

// configure the environment variables
dotenv.config({ path: envPath });

// create the configuration object
const config: { connectionString?: string; max?: number } = {};

// if the environment is production, use the DATABASE_URL
if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;

  // if the environment is not production, use the environment variables
} else {
  if (!process.env.PGDATABASE) {
    throw new Error("PGDATABASE not set");
  }
}

// create the pool
if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

export default new Pool(config);
