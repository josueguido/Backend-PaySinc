import request from "supertest";
import app from "../index.js";

describe("POST /api/auth/register", () => {
  it("debe registrar un usuario nuevo con datos válidos", async () => {
    const response = await request(app)
      .post("/api/auth/register")
      .send({
        username: "testuser_" + Date.now(),
        email: `test_${Date.now()}@mail.com`,
        password: "testpassword123",
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
  });

  it("debe rechazar si falta el email", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "incompleto",
      password: "123456",
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty("errors");
  });
});
