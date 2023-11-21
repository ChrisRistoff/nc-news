require("jest-sorted")
const supertest = require("supertest")
const data = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed")
const app = require("../app")
const db = require("../db/connection")
const articles = require("../db/data/test-data/articles")

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
  it("GET 200: Shoulrd return an array of objects containing articles to the user", async () => {
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
  it("GET 200: Should return all comments for an article to the user", async () => {
    const res = await supertest(app).get("/api/articles/1/comments");

    expect(res.statusCode).toBe(200);
    const comments = res.body.comments;

    expect(comments).toBeSortedBy("created_at", { descending: true });

    for (const comment of comments) {
      expect(comment.article_id).toBe(1);
      expect(comment).toEqual(
        expect.objectContaining({
          comment_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
        }),
      );
    }
  })
})

describe('articles', () => {
  it('GET 200: Return an article to the user', async () => {
    const res = await supertest(app).get("/api/articles/1")

    const article = res.body.article
    expect(res.statusCode).toBe(200)

    expect(article.article_id).toBe(1)
    expect(article).toEqual(expect.objectContaining({
      "author": expect.any(String),
      "title": expect.any(String),
      "body": expect.any(String),
      "topic": expect.any(String),
      "created_at": expect.any(String),
      "votes": expect.any(Number),
      "article_img_url": expect.any(String)
    }))
  })

  it('GET 404: Return an error to the user when an article is not found', async () => {
    const res = await supertest(app).get("/api/articles/12000")

    expect(res.statusCode).toBe(404)
    expect(res.body.msg).toBe("Article ID not found")
  })

  it('GET 400: Return an error to the user when invalid article ID is given', async() => {
    const res = await supertest(app).get("/api/articles/asdas")

    expect(res.statusCode).toBe(400)
    expect(res.body.msg).toBe("Invalid input")
  })
})

  it("GET 200: Should return an empty array when the article has no comments", async () => {
    const res = await supertest(app).get("/api/articles/36/comments");

    expect(res.statusCode).toBe(200);

    expect(res.body.comments.length).toBe(0);
  });

  it("GET 404: Should return an error to the user when article is not found", async () => {
    const res = await supertest(app).get("/api/articles/231321/comments");

    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe("Article ID not found");
  });

  it("GET 400: Should return an error to the user when article is not valid", async () => {
    const res = await supertest(app).get("/api/articles/asdas/comments");

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });
});
