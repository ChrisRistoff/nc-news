require("jest-sorted");
const supertest = require("supertest");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const app = require("../app");
const db = require("../db/connection");

beforeEach(async () => {
  await seed(data);
});

let server;
beforeAll(async () => {
  server = app.listen(0);
});

afterAll(async () => {
  await server.close();
  await db.end();
});

describe("topics", () => {
  it("GET 200: Should return an array of topic objects to the user", async () => {
    const res = await supertest(app).get("/api/topics");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.topics)).toBe(true);

    for (const topic of res.body.topics) {
      expect(topic).toHaveProperty("slug");
      expect(topic).toHaveProperty("description");
    }
  });
});


