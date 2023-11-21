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

describe("documentation", () => {
  it("POST 200: Should return an object ", async () => {
    const res = await supertest(app).get("/api");

    expect(res.statusCode).toBe(200);

    const docs = res.body;

    for (const key in docs) {
      if (key !== "GET /api") {
        expect(docs[key]).toHaveProperty("description");
        expect(docs[key]).toHaveProperty("queries");
        expect(docs[key]).toHaveProperty("exampleResponse");
        expect(Array.isArray(docs[key]["queries"])).toBe(true);
        expect(typeof docs[key]["exampleResponse"]).toBe("object");
      } else {
        expect(docs[key]).toHaveProperty("description");
        expect(docs[key]["description"]).toBe(
          "serves up a json representation of all the available endpoints of the api",
        );
      }
    }
  });
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

describe("articles", () => {
  it("GET 200: Should return an array of objects containing articles to the user", async () => {
    const res = await supertest(app).get("/api/articles");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.articles)).toBe(true);

    expect(res.body.articles).toBeSortedBy("created_at", { descending: true });

    for (const article of res.body.articles) {
      expect(article).toEqual(
        expect.objectContaining({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        }),
      );
    }
  });

  it("GET 200: Return an article to the user", async () => {
    const res = await supertest(app).get("/api/articles/1");

    const article = res.body.article;
    expect(res.statusCode).toBe(200);

    expect(article.article_id).toBe(1);
    expect(article).toEqual(
      expect.objectContaining({
        author: expect.any(String),
        title: expect.any(String),
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
      }),
    );
  });

  it("GET 404: Return an error to the user when an article is not found", async () => {
    const res = await supertest(app).get("/api/articles/12000");

    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe("Article ID not found");
  });

  it("GET 400: Return an error to the user when invalid article ID is given", async () => {
    const res = await supertest(app).get("/api/articles/asdas");

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });
});

describe("comments", () => {
  it("POST 201: Should create a new comment for an article", async () => {
    const res = await supertest(app).post("/api/articles/1/comments").send({
      username: "butter_bridge",
      body: "test body",
    });

    const comment = res.body.comment

    expect(res.statusCode).toBe(201);
    expect(comment.author).toBe("butter_bridge")
    expect(comment.body).toBe("test body")
    expect(comment.article_id).toBe(1)
    expect(comment).toHaveProperty("comment_id")
  });

  it("POST 201: Should create a new comment for an article when extra parameters in the body are given", async () => {
    const res = await supertest(app).post("/api/articles/1/comments").send({
      username: "butter_bridge",
      body: "test body",
      test: "testing"
    });

    const comment = res.body.comment

    expect(res.statusCode).toBe(201);
    expect(comment.author).toBe("butter_bridge")
    expect(comment.body).toBe("test body")
    expect(comment.article_id).toBe(1)
    expect(comment).toHaveProperty("comment_id")
  });


  it("POST 400: Should return an error when user gives invalid input for article ID", async () => {
    const res = await supertest(app).post("/api/articles/asdsa/comments").send({
      username: "butter_bridge",
      body: "test body",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });

  it("POST 404: Should return an error article with ID does not exist", async () => {
    const res = await supertest(app).post("/api/articles/12312312/comments").send({
      username: "butter_bridge",
      body: "test body",
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe("Article ID not found");
  });

  it("POST 400: Should return an error when user can not be found", async () => {
    const res = await supertest(app).post("/api/articles/1/comments").send({
      username: "asd",
      body: "test body",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Bad request");
  });

  it("POST 400: Should return an error when body is empty", async () => {
    const res = await supertest(app).post("/api/articles/1/comments").send({
      username: "butter_bridge",
      body: "",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Body can not be empty");
  });

  it("POST 400: Should return an error when body is missing", async () => {
    const res = await supertest(app).post("/api/articles/1/comments").send({
      username: "butter_bridge"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Body can not be empty");
  });
});
