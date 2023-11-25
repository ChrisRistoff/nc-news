import "jest-sorted"
import supertest from "supertest"
import * as data from "../db/data/test-data/index"
import {seed} from "../db/seeds/seed"
import {app} from "../app"
import db from "../db/connection"

let token: any;
let server: any;
beforeAll(async () => {
  await seed(data);

  const auth = await supertest(app)
    .post("/api/users/signin")
    .send({ username: "test", password: "password" });

  token = auth.body.token;
  server = app.listen(0);
});

afterAll(async () => {
  await server.close();
  await db.end();
});

describe("create article", () => {
  it("POST 201: Should create a new article and return it to the user", async () => {
    const res = await supertest(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "test article",
        body: "test article body",
        topic: "test",
        article_img_url: "test image",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.article).toEqual(
      expect.objectContaining({
        article_id: 39,
        author: "test",
        votes: 0,
        created_at: expect.any(String),
        topic: "test",
        title: "test article",
        body: "test article body",
        article_img_url: "test image",
        comment_count: 0,
      }),
    );
  });

  it("POST 201: Should create a new article when img_url is empty and return it to the user", async () => {
    const res = await supertest(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "test article2",
        body: "test article body",
        topic: "test",
        article_img_url: "",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.article).toEqual(
      expect.objectContaining({
        article_id: 40,
        votes: 0,
        author: "test",
        created_at: expect.any(String),
        topic: "test",
        title: "test article2",
        body: "test article body",
        article_img_url:
          "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700",
        comment_count: 0,
      }),
    );
  });

  it("POST 401: Should return an error when user is not authorised", async () => {
    const res = await supertest(app).post("/api/articles").send({
      title: "test article",
      body: "test article body",
      topic: "test",
      article_img_url: "",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe("You need to be logged in");
  });

  it("POST 404: Should return an error when title is empty", async () => {
    const res = await supertest(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "",
        body: "test article body",
        topic: "test",
        article_img_url: "",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });

  it("POST 404: Should return an error when title is missing", async () => {
    const res = await supertest(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        author: "rogersop",
        body: "test article body",
        topic: "test",
        article_img_url: "",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });

  it("POST 404: Should return an error when body is empty", async () => {
    const res = await supertest(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        author: "rogersop",
        title: "test",
        body: "",
        topic: "test",
        article_img_url: "",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });

  it("POST 404: Should return an error when body is missing", async () => {
    const res = await supertest(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        author: "rogersop",
        title: "test",
        topic: "test",
        article_img_url: "",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });

  it("POST 404: Should return an error when topic does not exist", async () => {
    const res = await supertest(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        author: "rogersop",
        title: "test",
        body: "test",
        topic: "randomTopic",
        article_img_url: "",
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe("Topic not found");
  });

  it("POST 404: Should return an error when topic is empty", async () => {
    const res = await supertest(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        author: "rogersop",
        title: "test",
        body: "test",
        topic: "",
        article_img_url: "",
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe("Topic not found");
  });

  it("POST 404: Should return an error when topic is missing", async () => {
    const res = await supertest(app)
      .post("/api/articles")
      .set("Authorization", `Bearer ${token}`)
      .send({
        author: "rogersop",
        title: "test",
        body: "test",
        article_img_url: "",
      });

    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe("Topic not found");
  });
});

describe("delete article", () => {
  it("DELETE 204: Should delete the article", async () => {
    const res = await supertest(app)
      .delete("/api/articles/1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(204);

    const checkArticle = await supertest(app).get("/api/articles/1");
    expect(checkArticle.statusCode).toBe(404);
    expect(checkArticle.body.msg).toBe("Article ID not found");

    const checkComments = await supertest(app).get("/api/articles/1/comments");
    expect(checkComments.statusCode).toBe(404);
    expect(checkComments.body.msg).toBe("Article ID not found");

    const deleteAgain = await supertest(app)
      .delete("/api/articles/1")
      .set("Authorization", `Bearer ${token}`);

    expect(deleteAgain.statusCode).toBe(404);
    expect(deleteAgain.body.msg).toBe("Article not found");
  });

  it("DELETE 404: Return an error when article does not exist", async () => {
    const res = await supertest(app)
      .delete("/api/articles/2123")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe("Article not found");
  });

  it("DELETE 400: Return an error when article ID is invalid", async () => {
    const res = await supertest(app)
      .delete("/api/articles/asd")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });
});

describe("edit article body", () => {
  it("PATCH 200: Should update article body and return the updated article", async () => {
    const res = await supertest(app)
      .patch("/api/edit/articles/2")
      .set("Authorization", `Bearer ${token}`)
      .send({
        body: "new test body",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.article).toEqual(
      expect.objectContaining({
        article_id: 2,
        votes: 100,
        author: "test",
        created_at: expect.any(String),
        topic: "test",
        title: "test article2",
        body: "new test body",
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        comment_count: 0,
      }),
    );
  });

  it('PATCH 401: Should return an error when user is not signed in', async () => {
     const res = await supertest(app)
      .patch("/api/edit/articles/2")
      .send({
        body: "new test body",
      });

    expect(res.statusCode).toBe(401)
    expect(res.body.msg).toBe("You need to be logged in")
  })

  it('PATCH 404: Should return an error article can not be found', async () => {
     const res = await supertest(app)
      .patch("/api/edit/articles/100")
      .set("Authorization", `Bearer ${token}`)
      .send({
        body: "new test body",
      });

    expect(res.statusCode).toBe(404)
    expect(res.body.msg).toBe("Article ID not found")
  })

  it('PATCH 400: Should return an error when body is empty', async () => {
     const res = await supertest(app)
      .patch("/api/edit/articles/2")
      .set("Authorization", `Bearer ${token}`)
      .send({
        body: "",
      });

    expect(res.statusCode).toBe(400)
    expect(res.body.msg).toBe("Invalid input")
  })

  it('PATCH 400: Should return an error when body is missing', async () => {
     const res = await supertest(app)
      .patch("/api/edit/articles/1")
      .set("Authorization", `Bearer ${token}`)
      .send({
      });

    expect(res.statusCode).toBe(400)
    expect(res.body.msg).toBe("Invalid input")
  })

  it('PATCH 400: Should return an error when article ID is invalid', async () => {
     const res = await supertest(app)
      .patch("/api/edit/articles/asda")
      .set("Authorization", `Bearer ${token}`)
      .send({
      });

    expect(res.statusCode).toBe(400)
    expect(res.body.msg).toBe("Invalid input")
  })

  it('PATCH 400: Should return an error when article belongs to another user', async () => {
     const res = await supertest(app)
      .patch("/api/edit/articles/4")
      .set("Authorization", `Bearer ${token}`)
      .send({
        body: "test body"
      });

    expect(res.statusCode).toBe(401)
    expect(res.body.msg).toBe("Article belongs to another user")
  })


});
