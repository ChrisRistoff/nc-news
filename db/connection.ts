import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

const ENV = process.env.NODE_ENV || "development";

let relativePath: string;
if (ENV === "production") {
  relativePath = `../../.env.${ENV}`;
} else {
  relativePath = ENV === "test" ? `../.env.${ENV}` : `../../.env.${ENV}`;
}

const envPath = path.resolve(__dirname, relativePath);

console.log(`Loading environment variables from: ${envPath}`);

dotenv.config({ path: envPath });

console.log(`Environment: ${ENV}`);
console.log(`PGDATABASE: ${process.env.PGDATABASE}`);

const config: { connectionString?: string; max?: number } = {};

if (ENV === "production") {
  config.connectionString = process.env.DATABASE_URL;
  config.max = 2;
} else {
  if (!process.env.PGDATABASE) {
    throw new Error("PGDATABASE not set");
  }
}

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}

export default new Pool(config);
