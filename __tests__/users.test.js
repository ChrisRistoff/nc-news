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

describe('get all users', () => {
  it('GET 200: Should return an array of all users to the user', async() => {
    const res = await supertest(app).get("/api/users")

    const users = res.body.users

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(users)).toBe(true);

    for (const user of users) {
      expect(user).toHaveProperty("username");
      expect(user).toHaveProperty("name");
      expect(user).toHaveProperty("avatar_url");
    }
  })
})
