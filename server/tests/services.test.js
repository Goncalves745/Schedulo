const request = require("supertest");
const app = require("../index");

describe("Services", () => {
  let token;

  beforeAll(async () => {
    // Login e obter token
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@email.com",
      password: "admin123",
    });
    token = res.body.token;
  });

  it("deve criar um novo serviço", async () => {
    const res = await request(app)
      .post("/api/business/services/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Corte",
        price: 15.0,
        duration_min: 30,
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
  });
});
