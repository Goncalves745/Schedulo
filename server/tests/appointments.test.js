const request = require("supertest");
const app = require("../index");

describe("Appointments", () => {
  let token;
  let serviceId;

  beforeAll(async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "admin@email.com",
      password: "admin123",
    });
    token = res.body.token;

    const serviceRes = await request(app)
      .post("/api/business/services/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Barba",
        price: 10.0,
        duration_min: 20,
      });
    serviceId = serviceRes.body.id;
  });

  it("deve criar uma marcação com sucesso", async () => {
    const res = await request(app)
      .post("/api/business/appointments/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        service_id: serviceId,
        date: new Date(Date.now() + 86400000).toISOString(),
        client_name: "João",
        client_email: "joao@email.com",
        client_phone: "912345678",
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("appointmentId");
  });
});
