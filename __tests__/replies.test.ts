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

describe("get replies", () => {
  it("GET 200: Should return an array of replies for a comment", async () => {
    const res = await supertest(app).get("/api/comments/1/replies");

    expect(res.statusCode).toBe(200);

    expect(res.body.replies.length).toBe(4);

    for (let reply of res.body.replies) {
      expect(reply.comment_id).toBe(1);

      expect(reply).toEqual(
        expect.objectContaining({
          reply_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
        }),
      );
    }
  });

  it("GET 404: Should return an error when comment is not found", async () => {
    const res = await supertest(app).get("/api/comments/21212/replies");

    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe("Comment not found");
  });

  it("GET 400: Should return an error when comment ID is not valid", async () => {
    const res = await supertest(app).get("/api/comments/asda/replies");

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input");
  });
});

describe("update votes", () => {
  it("PATCH 200: Should update reply votes", async () => {
    const res = await supertest(app)
      .patch("/api/replies/1")
      .send({ inc_votes: 100 });

    expect(res.statusCode).toBe(200);

    const reply = res.body.reply;

    expect(reply.reply_id).toBe(1);
    expect(reply.votes).toBe(102);
    expect(reply).toHaveProperty("body");
    expect(reply).toHaveProperty("author");
    expect(reply).toHaveProperty("created_at");
    expect(reply).toHaveProperty("comment_id");
  });

  it("PATCH 404: Should return an error when reply does not exist", async () => {
    const res = await supertest(app)
      .patch("/api/replies/1111")
      .send({ inc_votes: 100 });

    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe("Reply not found")
  });

  it("PATCH 400: Should return an error when inc_votes is invalid", async () => {
    const res = await supertest(app)
      .patch("/api/replies/1")
      .send({ inc_votes: "sada"});

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input")
  });

  it("PATCH 400: Should return an error when inc_votes is missing", async () => {
    const res = await supertest(app)
      .patch("/api/replies/1")

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input")
  });

  it("PATCH 400: Should return an error when reply ID is not valid", async () => {
    const res = await supertest(app)
      .patch("/api/replies/asda")

    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid input")
  });

});
