import "jest-sorted";
import supertest from "supertest";
import * as data from "../db/data/test-data/index";
import { seed } from "../db/seeds/seed";
import { app } from "../app";
import db from "../db/connection";

let server: any;
beforeAll(async () => {
  await seed(data);
  server = app.listen(0);
});

afterAll(async () => {
  await server.close();
  await db.end();
});

describe("get all articles", () => {
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

  it("GET 200: Should return all articles if given a topic as a query", async () => {
    const res = await supertest(app).get("/api/articles?topic=cats");

    expect(res.statusCode).toBe(200);
    const articles = res.body.articles;

    for (const article of articles) {
      expect(article).toEqual(
        expect.objectContaining({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: "cats",
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(Number),
        }),
      );
    }
  });

  it("GET 200: Should return an empty array if given a valid topic that has no articles", async () => {
    const res = await supertest(app).get("/api/articles?topic=empty_test");

    expect(res.statusCode).toBe(200);
    expect(res.body.articles.length).toBe(0);
  });

  it("GET 200: Should return articles sorted by parameter in the query", async () => {
    const res = await supertest(app).get("/api/articles?sort_by=topic");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.articles)).toBe(true);

    expect(res.body.articles).toBeSortedBy("topic", { descending: true });

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

  it("GET 200: Should return articles sorted by parameter and order in the query", async () => {
    const res = await supertest(app).get(
      "/api/articles?sort_by=topic&order=asc",
    );

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.articles)).toBe(true);

    expect(res.body.articles).toBeSortedBy("topic", { descending: false });

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

  it("GET 200: Should return articles sorted and filtered by parameter and order in the query", async () => {
    const res = await supertest(app).get(
      "/api/articles?sort_by=comment_count&order=asc&topic=mitch",
    );

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.articles)).toBe(true);

    expect(res.body.articles).toBeSortedBy("topic", { descending: false });

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

  it("GET 200: Should return articles paginated by default", async () => {
    const res = await supertest(app).get("/api/articles");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.articles)).toBe(true);
    expect(res.body.articles.length).toBe(10);

    expect(res.body.total_count).toBe(38);

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

  it("GET 200: Should return articles paginated by query params", async () => {
    const res = await supertest(app).get(
      "/api/articles?p=2&limit=6&sort_by=article_id&order=asc",
    );

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.articles)).toBe(true);
    expect(res.body.articles.length).toBe(6);
    expect(res.body.articles[0].article_id).toBe(7);
    expect(res.body.articles[5].article_id).toBe(12);

    expect(res.body.total_count).toBe(38);

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

  it("GET 200: Should return an error if page is not a valid input", async () => {
    const res = await supertest(app).get("/api/articles?p=asds&limit=6");

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });

  it("GET 200: Should return an error if limit is not a valid input", async () => {
    const res = await supertest(app).get("/api/articles?p=2&limit=asd");

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });

  it("GET 400: Should return an error if sort_by value does not exist", async () => {
    const res = await supertest(app).get(
      "/api/articles?sort_by=;DELETE FROM topics;",
    );

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });

  it("GET 400: Should return an error if order value does not exist", async () => {
    const res = await supertest(app).get(
      "/api/articles?order=;DELETE FROM topics;",
    );

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });

  it("GET 404: Should return an error if topic does not exist", async () => {
    const res = await supertest(app).get(
      "/api/articles?topic=;DELETE FROM topics;",
    );

    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe("Topic not found");
  });
});

describe("get article by ID", () => {
  it("GET 200: Return an article to the user", async () => {
    const res = await supertest(app).get("/api/articles/1");

    const article = res.body.article;
    expect(res.statusCode).toBe(200);

    expect(article).toEqual(
      expect.objectContaining({
        article_id: 1,
        author: expect.any(String),
        title: expect.any(String),
        body: expect.any(String),
        topic: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
        comment_count: 11,
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

describe("update article", () => {
  it("PATCH 201: Should return updated article object to the user", async () => {
    const res = await supertest(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 100 });

    expect(res.statusCode).toBe(200);
    expect(res.body.newArticle.article_id).toBe(1);
    expect(res.body.newArticle).toEqual(
      expect.objectContaining({
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
      }),
    );
  });

  it("PATCH 201: Should return updated article object to the user when given extra parameters in the body", async () => {
    const res = await supertest(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 100, test_param: "test" });

    expect(res.statusCode).toBe(200);
    expect(res.body.newArticle.article_id).toBe(1);
    expect(res.body.newArticle).toEqual(
      expect.objectContaining({
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
        article_img_url: expect.any(String),
      }),
    );
  });

  it("PATCH, GET 200: Should update the votes in the article", async () => {
    const getArticle = await supertest(app).get("/api/articles/1");
    expect(getArticle.statusCode).toBe(200);
    const votes = getArticle.body.article.votes;

    const inc_votes = 100;
    const updateArticle = await supertest(app)
      .patch("/api/articles/1")
      .send({ inc_votes });
    expect(updateArticle.statusCode).toBe(200);

    const updatedArticle = await supertest(app).get("/api/articles/1");
    expect(updatedArticle.statusCode).toBe(200);
    const updatedVotes = updatedArticle.body.article.votes;

    expect(updatedVotes === votes + inc_votes).toBe(true);
  });

  it("PATCH 404: should return an error when article id is not found", async () => {
    const res = await supertest(app)
      .patch("/api/articles/1000")
      .send({ inc_votes: 100 });

    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe("Article ID not found");
  });

  it("PATCH 400: should return an error when an invalid article id is given", async () => {
    const res = await supertest(app)
      .patch("/api/articles/asdas")
      .send({ inc_votes: 100 });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });

  it("PATCH 400: should return an error when an invalid inc_votes is given", async () => {
    const res = await supertest(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "asdas" });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input for increment votes");
  });
});
