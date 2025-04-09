const request = require("supertest");
const app = require("../../app"); // Agora importa o app puro

describe("GET /api/public/:slug/services", () => {
  it("deve retornar os serviços de uma empresa", async () => {
    const response = await request(app).get(
      "/api/public/barbearia-miguel-goncalves/services"
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.services).toBeInstanceOf(Array);
  });
});
