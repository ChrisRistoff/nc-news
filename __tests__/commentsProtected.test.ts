import "jest-sorted";
import supertest from "supertest";
import * as data from "../db/data/test-data/index";
import { seed } from "../db/seeds/seed";
import { app } from "../app";
import db from "../db/connection";

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

  it("DELETE 204: Comment should be deleted", async () => {
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

describe("edit comments", () => {
  it("PATCH 200: Should update a comment by comment ID", async () => {
    const res = await supertest(app)
      .patch("/api/comments/2/edit")
      .send({
        body: "edited test body",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    const comment = res.body.comment;

    expect(comment.author).toBe("test");
    expect(comment.body).toBe("edited test body");
    expect(comment.article_id).toBe(9);
    expect(comment).toHaveProperty("comment_id");
  });

  it("PATCH 401: Should return an error when user is not signed in", async () => {
    const res = await supertest(app).patch("/api/comments/2/edit").send({
      body: "edited test body",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe("You need to be logged in");
  });

  it("PATCH 404: Should return an error comment ID is not found", async () => {
    const res = await supertest(app)
      .patch("/api/comments/1000/edit")
      .send({
        body: "edited test body",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe("Comment ID not found");
  });

  it("PATCH 401: Should return an error when comment belongs to another user", async () => {
    const res = await supertest(app)
      .patch("/api/comments/10/edit")
      .send({
        body: "edited test body",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe("Comment belongs to another user");
  });

  it("PATCH 400: Should return an error when body is empty", async () => {
    const res = await supertest(app)
      .patch("/api/comments/2/edit")
      .send({
        body: "",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });

  it("PATCH 400: Should return an error when body is missing", async () => {
    const res = await supertest(app)
      .patch("/api/comments/2/edit")
      .send({})
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });
});
