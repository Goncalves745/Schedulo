const request = require("supertest");
const app = require("../index");

describe("Auth", () => {
  it("deve falhar login com credenciais erradas", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "wrong@email.com",
      password: "wrongpassword",
    });
    expect(res.statusCode).toBe(401);
  });
});
