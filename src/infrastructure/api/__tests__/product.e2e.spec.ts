import { app, setupDb, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product API", () => {
  beforeEach(async () => {
    await setupDb();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        id: "1",
        name: "Product 1",
        description: "Product 1 description",
        purchasePrice: 100,
        stock: 10,
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBe("1");
    expect(response.body.name).toBe("Product 1");
    expect(response.body.description).toBe("Product 1 description");
    expect(response.body.purchasePrice).toBe(100);
    expect(response.body.stock).toBe(10);
  });

  it("should return 500 when missing required fields", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        name: "Product 1",
      });

    expect(response.status).toBe(500);
  });
});
