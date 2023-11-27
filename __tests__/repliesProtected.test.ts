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

describe("create replies", () => {
  it("POST 201: Should create a new reply for a comment", async () => {
    const res = await supertest(app)
      .post("/api/comments/1/replies")
      .send({
        body: "test body",
      })
      .set("Authorization", `Bearer ${token}`);

    const reply = res.body.reply;

    expect(res.statusCode).toBe(201);
    expect(reply.author).toBe("test");
    expect(reply.body).toBe("test body");
    expect(reply.comment_id).toBe(1);
    expect(reply).toHaveProperty("reply_id");
  });

  it("POST 401: Should return an error when user is not signed in", async () => {
    const res = await supertest(app).post("/api/comments/1/replies").send({
      body: "test body",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.msg).toBe("You need to be logged in");
  });

  it("POST 404: Should return an error when comment_id is not found", async () => {
    const res = await supertest(app)
      .post("/api/comments/1111/replies")
      .send({
        body: "test body",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe("Comment not found");
  });

  it("POST 400: Should return an error when comment_id is not valid", async () => {
    const res = await supertest(app)
      .post("/api/comments/sdasdas/replies")
      .send({
        body: "test body",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });

  it("POST 400: Should return an error when body is empty", async () => {
    const res = await supertest(app)
      .post("/api/comments/1/replies")
      .send({
        body: "",
      })
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });

  it("POST 400: Should return an error when body is missing", async () => {
    const res = await supertest(app)
      .post("/api/comments/1/replies")
      .send({})
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });
});
