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

describe('get replies', () => {
  it('GET 200: Should return an array of replies for a comment', async () => {
    const res = await supertest(app).get("/api/comments/1/replies")

    expect(res.statusCode).toBe(200)

    expect(res.body.replies.length).toBe(3)

    for(let reply of res.body.replies) {
      expect(reply.comment_id).toBe(1)

      expect(reply).toEqual(
        expect.objectContaining({
          reply_id: expect.any(Number),
          votes: expect.any(Number),
          created_at: expect.any(String),
          author: expect.any(String),
          body: expect.any(String)
        })
      )
    }
  })

  it('GET 404: Should return an error when comment is not found', async () => {
    const res = await supertest(app).get("/api/comments/21212/replies")

    expect(res.statusCode).toBe(404)
    expect(res.body.msg).toBe("Comment not found")
  })

  it('GET 400: Should return an error when comment ID is not valid', async () => {
    const res = await supertest(app).get("/api/comments/asda/replies")

    expect(res.statusCode).toBe(400)
    expect(res.body.msg).toBe("Invalid input")
  })
})
