import { app, setupDb, sequelize } from "../express";
import request from "supertest";
import { ProductModel } from "../../../modules/product-adm/repository/product.model";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";

describe("E2E test for checkout API", () => {
  beforeEach(async () => {
    await setupDb();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should place an order", async () => {
    // Create a client first
    await ClientModel.create({
      id: "1c",
      name: "Client 1",
      email: "client@email.com",
      document: "12345678900",
      street: "Street 1",
      number: "100",
      complement: "Apt 1",
      city: "City 1",
      state: "State 1",
      zipcode: "12345678",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create products with all required fields for both product-adm and store-catalog
    await ProductModel.create({
      id: "1p",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 50,
      salesPrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await ProductModel.create({
      id: "2p",
      name: "Product 2",
      description: "Product 2 description",
      purchasePrice: 80,
      salesPrice: 150,
      stock: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app)
      .post("/checkout")
      .send({
        clientId: "1c",
        products: [{ productId: "1p" }, { productId: "2p" }],
      });

    expect(response.status).toBe(201);
    expect(response.body.id).toBeDefined();
    expect(response.body.total).toBe(250);
    expect(response.body.products.length).toBe(2);
    expect(response.body.products[0].productId).toBe("1p");
    expect(response.body.products[1].productId).toBe("2p");
  });

  it("should return 500 when client is not found", async () => {
    const response = await request(app)
      .post("/checkout")
      .send({
        clientId: "non-existent",
        products: [{ productId: "1" }],
      });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Client not found");
  });

  it("should return 500 when no products are provided", async () => {
    // Create a client first
    await ClientModel.create({
      id: "1c",
      name: "Client 1",
      email: "client@email.com",
      document: "12345678900",
      street: "Street 1",
      number: "100",
      complement: "Apt 1",
      city: "City 1",
      state: "State 1",
      zipcode: "12345678",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app)
      .post("/checkout")
      .send({
        clientId: "1c",
        products: [],
      });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("No products selected");
  });

  it("should return 500 when product is out of stock", async () => {
    // Create a client first
    await ClientModel.create({
      id: "1c",
      name: "Client 1",
      email: "client@email.com",
      document: "12345678900",
      street: "Street 1",
      number: "100",
      complement: "Apt 1",
      city: "City 1",
      state: "State 1",
      zipcode: "12345678",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Create a product with 0 stock
    await ProductModel.create({
      id: "1p",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 50,
      salesPrice: 100,
      stock: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app)
      .post("/checkout")
      .send({
        clientId: "1c",
        products: [{ productId: "1p" }],
      });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Product 1p is not available in stock");
  });
});
