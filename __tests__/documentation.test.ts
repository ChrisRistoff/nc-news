import supertest from "supertest";
import { app } from "../app";
import db from "../db/connection";

let server: any;
beforeAll(async () => {
  server = app.listen(0);
});

afterAll(async () => {
  await server.close();
  await db.end();
});

describe("documentation", () => {
  it("POST 200: Should return an object ", async () => {
    const res = await supertest(app).get("/api");

    expect(res.statusCode).toBe(200);

    const docs = res.body;

    for (const key in docs) {
      if (key !== "GET /api") {
        expect(docs[key]).toHaveProperty("description");
        expect(docs[key]).toHaveProperty("queries");
        expect(docs[key]).toHaveProperty("authorization");
        expect(docs[key]).toHaveProperty("exampleResponse");
        expect(Array.isArray(docs[key]["queries"])).toBe(true);
        expect(typeof docs[key]["exampleResponse"]).toBe("object");
      } else {
        expect(docs[key]).toHaveProperty("description");
        expect(docs[key]["description"]).toBe(
          "serves up a json representation of all the available endpoints of the api",
        );
      }
    }
  });
});
