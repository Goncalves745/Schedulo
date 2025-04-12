const request = require("supertest");
const app = require("../index");

describe("Availability", () => {
  let token;

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@email.com",
      password: "admin123",
    });
    token = res.body.token;
  });

  it("deve adicionar disponibilidade sem conflitos", async () => {
    const res = await request(app)
      .post("/api/business/settings/hours")
      .set("Authorization", `Bearer ${token}`)
      .send({
        businessHours: {
          monday: { isOpen: true, open: "09:00", close: "17:00" },
        },
      });
    expect(res.statusCode).toBe(200);
  });
});
