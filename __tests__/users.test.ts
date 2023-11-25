import "jest-sorted"
import supertest from "supertest"
import {app} from "../app"
import db from "../db/connection"

let server: any;
beforeAll(async () => {
  server = app.listen(0);
});

afterAll(async () => {
  await server.close();
  await db.end();
});

describe("get all users", () => {
  it("GET 200: Should return an array of all users to the user", async () => {
    const res = await supertest(app).get("/api/users");

    const users = res.body.users;

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(users)).toBe(true);
    expect(users.length > 0).toBe(true);

    for (const user of users) {
      expect(user).toHaveProperty("username");
      expect(user).toHaveProperty("name");
      expect(user).toHaveProperty("avatar_url");
    }
  });
});

describe("get user by username", () => {
  it("GET 200: Should return an object with the user to the user", async () => {
    const res = await supertest(app).get("/api/users/rogersop");

    expect(res.statusCode).toBe(200);
    expect(res.body.user.username).toBe("rogersop");
    expect(res.body.user.name).toBe("paul");
    expect(res.body.user.avatar_url).toBe(
      "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
    );
  });

  it("GET 404: Should return an error when user is not found", async () => {
    const res = await supertest(app).get("/api/users/asdasdasd");

    expect(res.statusCode).toBe(404);
    expect(res.body.msg).toBe("User not found");
    expect(res.body.token).not.toBeDefined()
  });
});

describe("create user", () => {
  it("POST 201: Should create a new user", async () => {
    const res = await supertest(app).post("/api/users/signup").send({
      username: "username",
      name: "name",
      password: "password",
    });

    expect(res.statusCode).toBe(201)
    expect(res.body.token).toBeDefined()
  });

  it("POST 409: Should return an error if user already exist", async () => {
    const res = await supertest(app).post("/api/users/signup").send({
      username: "test",
      name: "name",
      password: "password",
    });

    expect(res.statusCode).toBe(409)
    expect(res.body.msg).toBe("User already exists")
    expect(res.body.token).not.toBeDefined()
  });
});

describe('sign in', () => {
  it('POST 200; Should return a token when a valid user signs in', async () => {
    const res = await supertest(app).post("/api/users/signin").send({
      username: "test",
      password: "password"
    })

    expect(res.statusCode).toBe(200)
    expect(res.body.token).toBeDefined()
  })

  it('POST 404: Should return an error if the user does not exist', async () => {
    const res = await supertest(app).post("/api/users/signin").send({
      username: "testerrrr",
      password: "password"
    })

    expect(res.statusCode).toBe(404)
    expect(res.body.msg).toBe("User not found")
    expect(res.body.token).not.toBeDefined()
  })

  it('POST 409: Should return an error if the passwords do not match', async () => {
    const res = await supertest(app).post("/api/users/signin").send({
      username: "test",
      password: "passwordss"
    })

    expect(res.statusCode).toBe(401)
    expect(res.body.msg).toBe("Incorrect password")
    expect(res.body.token).not.toBeDefined()
  })
})
