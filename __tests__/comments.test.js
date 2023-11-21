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

describe('get comments for article', () => {
  it('GET 200: Should return all comments', async() => {
    const res = await supertest(app).get("/api/articles/1/comments")

    expect(res.statusCode).toBe(200)
    const comments = res.body.comments

    for (const comment of comments) {
      expect(comment.article_id).toBe(1)
      expect(comment).toEqual(expect.objectContaining({
        "comment_id": expect.any(Number),
        "votes": expect.any(Number),
        "created_at": expect.any(String),
        "author": expect.any(String),
        "body": expect.any(String),
      }))
    }
  })

  it('GET 200: Should return an empty array when the article has no comments', async () => {
    const res = await supertest(app).get("/api/articles/36/comments")

    expect(res.statusCode).toBe(200)
    expect(res.body.comments.length).toBe(0)
  })

  it('GET 404: Should return an error to the user when article is not found', async () => {
    const res = await supertest(app).get("/api/articles/231321/comments")

    expect(res.statusCode).toBe(404)
    expect(res.body.msg).toBe("Article ID not found")
  })

  it('GET 400: Should return an error to the user when article is not valid', async () => {
    const res = await supertest(app).get("/api/articles/asdas/comments")

    expect(res.statusCode).toBe(400)
    expect(res.body.msg).toBe("Invalid input")
  })
})

describe("create comments", () => {
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

describe('delete comment', () => {
  it('DELETE 204: Should delete comment', async () => {
    const res = await supertest(app).delete("/api/comments/1")

    expect(res.statusCode).toBe(204)
  })

  it('POST 200, 204: Comment should be deleted', async () => {
    const comments = await supertest(app).get("/api/articles/1/comments")
    expect(comments.statusCode).toBe(200)

    const commentId = comments.body.comments[0].comment_id

    const deleteComment = await supertest(app).delete(`/api/comments/${commentId}`)
    expect(deleteComment.statusCode).toBe(204)

    const updatedComments = await supertest(app).get("/api/articles/1/comments")
    expect(updatedComments.statusCode).toBe(200)

    expect(commentId !== updatedComments.body.comments[0].comment_id).toBe(true)
  })

  it('DELETE 400: Should return an error when invalid commend ID is given', async () => {
    const res = await supertest(app).delete("/api/comments/asds")

    expect(res.statusCode).toBe(400)
    expect(res.body.msg).toBe("Invalid input")
  })
})
