require("jest-sorted")
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

describe('documentation', () => {
  it('POST 200: Should return an object ', async () => {
    const res = await supertest(app).get("/api")

    expect(res.statusCode).toBe(200)

    const docs = res.body

    for (const key in docs) {
      if (key !== "GET /api") {
        expect(docs[key]).toHaveProperty("description")
        expect(docs[key]).toHaveProperty("queries")
        expect(docs[key]).toHaveProperty("exampleResponse")
        expect(Array.isArray(docs[key]["queries"])).toBe(true)
        expect(typeof docs[key]["exampleResponse"]).toBe("object")
      } else {
        expect(docs[key]).toHaveProperty("description")
        expect(docs[key]["description"]).toBe("serves up a json representation of all the available endpoints of the api")
      }
    }
  })
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
  it('GET 200: Shoulrd return an array of objects containing articles to the user', async() => {
    const res = await supertest(app).get("/api/articles")

    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body.articles)).toBe(true)

    expect(res.body.articles).toBeSortedBy("created_at", {descending: true})

    for (const article of res.body.articles) {
      expect(article).toEqual(expect.objectContaining({
        "author": expect.any(String),
        "title": expect.any(String),
        "article_id": expect.any(Number),
        "topic": expect.any(String),
        "created_at": expect.any(String),
        "votes": expect.any(Number),
        "article_img_url": expect.any(String),
        "comment_count": expect.any(Number),
      }))
    }

  })
})
