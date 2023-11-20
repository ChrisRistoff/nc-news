const supertest = require("supertest")
const data = require("../db/data/test-data/index")
const seed = require("../db/seeds/seed")
const app = require("../app")
const db = require("../db/connection")


beforeEach(async () => {
  await seed(data)
})

let server
beforeAll(async () => {
  server = app.listen(0)
})

afterAll(async () => {
  await server.close()
  await db.end()
})


describe('topics', () => {
  it('POST 200: Should return an array of topic objects to the user', async () => {
    const res = await supertest(app).get("/api/topics")

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body.topics)).toBe(true)

    for (const topic of res.body.topics) {
      expect(topic).toHaveProperty("slug")
      expect(topic).toHaveProperty("description")
    }
  })
})

describe('articles', () => {
  it('POST 200: Return an article to the user', async () => {
    const res = await supertest(app).get("/api/articles/1")

    const article = res.body.article
    expect(res.statusCode).toBe(200)

    expect(article).toHaveProperty("author")
    expect(article).toHaveProperty("title")
    expect(article).toHaveProperty("article_id")
    expect(article).toHaveProperty("body")
    expect(article).toHaveProperty("topic")
    expect(article).toHaveProperty("created_at")
    expect(article).toHaveProperty("votes")
    expect(article).toHaveProperty("article_img_url")
  })

  it('POST 404: Return an error to the user when an article is not found', async () => {
    const res = await supertest(app).get("/api/articles/12000")

    expect(res.statusCode).toBe(404)
    expect(res.body.msg).toBe("Article ID not found")
  })
})
