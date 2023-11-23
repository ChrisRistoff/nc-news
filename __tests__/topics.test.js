require("jest-sorted");
const supertest = require("supertest");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const app = require("../app");
const db = require("../db/connection");

let token;
beforeEach(async () => {
  await seed(data);
  const auth = await supertest(app)
    .post("/api/users/signin")
    .send({ username: "test", password: "password" });

  token = auth.body.token;
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

describe("create topic", () => {
  it("POST 201: Should create a new topic and return the object to the user", async () => {
    const res = await supertest(app)
      .post("/api/topics")
      .send({
        slug: "testt",
        description: "testing",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.topic.slug).toBe("testt");
    expect(res.body.topic.description).toBe("testing");
  });

  it("POST 201: Should create a new topic and return the object to the user when extra parameters in the body are given", async () => {
    const res = await supertest(app)
      .post("/api/topics")
      .send({
        slug: "testt",
        description: "testing",
        test: "test",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(201);
    expect(res.body.topic.slug).toBe("testt");
    expect(res.body.topic.description).toBe("testing");
  });

  it("POST 409: Should return an error if topic already exists", async () => {
    const res = await supertest(app)
      .post("/api/topics")
      .send({
        slug: "test",
        description: "testing",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(409);
    expect(res.body.msg).toBe("Already exists");
  });

  it("POST 400: Should return an error if slug is empty", async () => {
    const res = await supertest(app)
      .post("/api/topics")
      .send({
        slug: "",
        description: "testing",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });

  it("POST 400: Should return an error if slug is missing", async () => {
    const res = await supertest(app)
      .post("/api/topics")
      .send({
        description: "testing",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });

  it("POST 400: Should return an error if body is empty", async () => {
    const res = await supertest(app)
      .post("/api/topics")
      .send({
        slug: "testt",
        description: "",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });

  it("POST 400: Should return an error if body is missing", async () => {
    const res = await supertest(app)
      .post("/api/topics")
      .send({
        slug: "testt",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });
});
