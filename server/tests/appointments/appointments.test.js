const request = require("supertest");
const app = require("../../app"); // Agora importa o app puro

describe("POST /api/business/appointments/create", () => {
  it("deve criar uma marcação com sucesso", async () => {
    const response = await request(app)
      .post("/api/business/appointments/create") // lembra-te do /api
      .send({
        service_id: "626a4c49-b3d8-4a0b-8256-7a9eb9a92adb",
        date: new Date(Date.now() + 86400000).toISOString(),
        client_name: "Teste",
        client_email: "teste@email.com",
        client_phone: "912345678",
        notes: "Nenhuma",
      })
      .set("Authorization", `Bearer 352dbe71-1990-4b45-995e-1db74518923b`);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("appointmentId");
  });
});
