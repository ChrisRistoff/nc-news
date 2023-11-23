require("jest-sorted");
const supertest = require("supertest");
const data = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const app = require("../app");
const db = require("../db/connection");

let token;
beforeEach(async () => {
});

let server;
beforeAll(async () => {
  const auth = await supertest(app)
    .post("/api/users/signin")
    .send({ username: "test", password: "password" });

  token = auth.body.token;

  await seed(data);
  server = app.listen(0);
});

afterAll(async () => {
  await server.close();
  await db.end();
});

describe("get comments for article", () => {
  it("GET 200: Should return all comments", async () => {
    const res = await supertest(app).get("/api/articles/1/comments");

    expect(res.statusCode).toBe(200);
    const comments = res.body.comments;

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
  });

  it("GET 200: Should return an empty array when the article has no comments", async () => {
    const res = await supertest(app).get("/api/articles/36/comments");

    expect(res.statusCode).toBe(200);
    expect(res.body.comments.length).toBe(0);
  });

  it("GET 200: Should paginate results by default", async () => {
    const res = await supertest(app).get("/api/articles/1/comments");

    expect(res.statusCode).toBe(200);
    const comments = res.body.comments;
    expect(comments.length).toBe(10);

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
  });

  it("GET 200: Should paginate results by given params", async () => {
    const res = await supertest(app).get(
      "/api/articles/1/comments?p=2&limit=2",
    );

    expect(res.statusCode).toBe(200);
    const comments = res.body.comments;
    expect(comments.length).toBe(2);

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
  });

  it("GET 400: Should return an error when given invalid input for page", async () => {
    const res = await supertest(app).get(
      "/api/articles/1/comments?p=asd&limit=2",
    );

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });

  it("GET 400: Should return an error when given invalid input for limit", async () => {
    const res = await supertest(app).get(
      "/api/articles/1/comments?p=1&limit=asd",
    );

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
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

describe("create comments", () => {
  it("POST 201: Should create a new comment for an article", async () => {
    const res = await supertest(app)
      .post("/api/articles/1/comments")
      .send({
        body: "test body",
      })
      .set("Authorization", `Bearer ${token}`);

    const comment = res.body.comment;

    expect(res.statusCode).toBe(201);
    expect(comment.author).toBe("test");
    expect(comment.body).toBe("test body");
    expect(comment.article_id).toBe(1);
    expect(comment).toHaveProperty("comment_id");
  });

  it("POST 201: Should create a new comment for an article when extra parameters in the body are given", async () => {
    const res = await supertest(app)
      .post("/api/articles/1/comments")
      .send({
        body: "test body",
        test: "testing",
      })
      .set("Authorization", `Bearer ${token}`);

    const comment = res.body.comment;

    expect(res.statusCode).toBe(201);
    expect(comment.author).toBe("test");
    expect(comment.body).toBe("test body");
    expect(comment.article_id).toBe(1);
    expect(comment).toHaveProperty("comment_id");
  });

  it("POST 401: Should return an error when the user is not logged in", async () => {
    const res = await supertest(app).post("/api/articles/1/comments").send({
      body: "test body",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe("You need to be logged in");
  });

  it("POST 400: Should return an error when user gives invalid input for article ID", async () => {
    const res = await supertest(app)
      .post("/api/articles/asdsa/comments")
      .send({
        username: "butter_bridge",
        body: "test body",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });

  it("POST 404: Should return an error article with ID does not exist", async () => {
    const res = await supertest(app)
      .post("/api/articles/12312312/comments")
      .send({
        username: "butter_bridge",
        body: "test body",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe("Article ID not found");
  });

  it("POST 400: Should return an error when body is empty", async () => {
    const res = await supertest(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Body can not be empty");
  });

  it("POST 400: Should return an error when body is missing", async () => {
    const res = await supertest(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Body can not be empty");
  });
});

describe("delete comment", () => {
  it("DELETE 204: Should delete comment", async () => {
    const res = await supertest(app)
      .delete("/api/comments/1")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });

  it("POST 200, 204: Comment should be deleted", async () => {
    const comments = await supertest(app).get("/api/articles/1/comments");
    expect(comments.statusCode).toBe(200);

    const commentId = comments.body.comments[0].comment_id;

    const deleteComment = await supertest(app)
      .delete(`/api/comments/${commentId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteComment.statusCode).toBe(204);

    const updatedComments = await supertest(app).get(
      "/api/articles/1/comments",
    );
    expect(updatedComments.statusCode).toBe(200);

    for (const comment of updatedComments.body.comments) {
      expect(comment.comment_id !== commentId).toBe(true);
    }
  });

  it("DELETE 400: Should return an error when invalid commend ID is given", async () => {
    const res = await supertest(app)
      .delete("/api/comments/asds")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });

  it("DELETE 404: Should return an error when article ID does not exist", async () => {
    const res = await supertest(app)
      .delete("/api/comments/1200")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe("Comment does not exist");
  });
});

describe("update comment by ID", () => {
  it("PATCH 200: Should return an updated comment to the user", async () => {
    const res = await supertest(app)
      .patch("/api/comments/2")
      .send({ inc_votes: 100 });

    expect(res.statusCode).toBe(200);
    expect(res.body.newComment).toEqual(
      expect.objectContaining({
        body: expect.any(String),
        votes: 114,
        author: "butter_bridge",
        article_id: 1,
        created_at: expect.any(String),
      }),
    );
  });

  it("PATCH 200: Should update the original comment", async () => {
    let article = await supertest(app).get("/api/articles/1/comments");
    expect(article.statusCode).toBe(200);

    const initialVootes = article.body.comments[0].votes;
    const comment_id = article.body.comments[0].comment_id;

    await supertest(app)
      .patch(`/api/comments/${comment_id}`)
      .send({ inc_votes: 100 })
      .expect(200);

    article = await supertest(app).get("/api/articles/1/comments");
    expect(article.statusCode).toBe(200);
    const newVotes = article.body.comments[0].votes;

    expect(newVotes === initialVootes + 100).toBe(true);
  });

  it("PATCH 404: Should return an error when comment is not found", async () => {
    const res = await supertest(app)
      .patch("/api/comments/1231")
      .send({ inc_votes: 100 });

    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe("Comment ID not found");
  });

  it("PATCH 400: Should return an error when comment ID is not valid", async () => {
    const res = await supertest(app)
      .patch("/api/comments/asda")
      .send({ inc_votes: 100 });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });

  it("PATCH 400: Should return an error when inc_votes is invalid", async () => {
    const res = await supertest(app)
      .patch("/api/comments/1")
      .send({ inc_votes: "asd" });

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });

  it("PATCH 400: Should return an error when inc_votes is missing", async () => {
    const res = await supertest(app).patch("/api/comments/1");

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });
});
