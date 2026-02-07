import { app, setupDb, sequelize } from "../express";
import request from "supertest";

describe("E2E test for client API", () => {
  beforeEach(async () => {
    await setupDb();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a client", async () => {
    const response = await request(app)
      .post("/clients")
      .send({
        id: "1",
        name: "Client 1",
        email: "client@email.com",
        document: "12345678900",
        address: {
          street: "Street 1",
          number: "100",
          complement: "Apt 1",
          city: "City 1",
          state: "State 1",
          zipCode: "12345678",
        },
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBe("1");
    expect(response.body.name).toBe("Client 1");
    expect(response.body.email).toBe("client@email.com");
    expect(response.body.document).toBe("12345678900");
    expect(response.body.address.street).toBe("Street 1");
    expect(response.body.address.number).toBe("100");
    expect(response.body.address.city).toBe("City 1");
    expect(response.body.address.state).toBe("State 1");
    expect(response.body.address.zipCode).toBe("12345678");
  });

  it("should return 500 when missing required fields", async () => {
    const response = await request(app)
      .post("/clients")
      .send({
        name: "Client 1",
      });

    expect(response.status).toBe(500);
  });
});
