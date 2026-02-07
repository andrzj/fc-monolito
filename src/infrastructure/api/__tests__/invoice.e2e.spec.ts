import { app, setupDb, sequelize } from "../express";
import request from "supertest";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import { InvoiceItemModel } from "../../../modules/invoice/repository/invoice-item.model";

describe("E2E test for invoice API", () => {
  beforeEach(async () => {
    await setupDb();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should find an invoice by id", async () => {
    // First, create an invoice directly in the database
    await InvoiceModel.create(
      {
        id: "1",
        name: "Invoice 1",
        document: "12345678900",
        street: "Street 1",
        number: "100",
        complement: "Apt 1",
        city: "City 1",
        state: "State 1",
        zipcode: "12345678",
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [
          {
            id: "item-1",
            name: "Item 1",
            price: 100,
          },
          {
            id: "item-2",
            name: "Item 2",
            price: 200,
          },
        ],
      },
      {
        include: [{ model: InvoiceItemModel }],
      }
    );

    const response = await request(app).get("/invoice/1");

    expect(response.status).toBe(200);
    expect(response.body.id).toBe("1");
    expect(response.body.name).toBe("Invoice 1");
    expect(response.body.document).toBe("12345678900");
    expect(response.body.address.street).toBe("Street 1");
    expect(response.body.address.number).toBe("100");
    expect(response.body.address.city).toBe("City 1");
    expect(response.body.address.state).toBe("State 1");
    expect(response.body.address.zipCode).toBe("12345678");
    expect(response.body.items.length).toBe(2);
    expect(response.body.total).toBe(300);
  });

  it("should return 500 when invoice is not found", async () => {
    const response = await request(app).get("/invoice/non-existent");

    expect(response.status).toBe(500);
  });
});
