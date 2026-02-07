import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import ProductCatalogModel from "../../modules/store-catalog/repository/product.model";
import { ClientModel } from "../../modules/client-adm/repository/client.model";
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import { InvoiceItemModel } from "../../modules/invoice/repository/invoice-item.model";
import { OrderModel } from "../../modules/checkout/repository/order.model";
import { OrderItemModel } from "../../modules/checkout/repository/order-item.model";
import { productRoute } from "./routes/product.route";
import { clientRoute } from "./routes/client.route";
import { checkoutRoute } from "./routes/checkout.route";
import { invoiceRoute } from "./routes/invoice.route";

export const app: Express = express();
app.use(express.json());
app.use("/products", productRoute);
app.use("/clients", clientRoute);
app.use("/checkout", checkoutRoute);
app.use("/invoice", invoiceRoute);

export let sequelize: Sequelize;

export async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });

  await sequelize.addModels([
    ProductModel,
    ProductCatalogModel,
    ClientModel,
    InvoiceModel,
    InvoiceItemModel,
    OrderModel,
    OrderItemModel,
  ]);
  await sequelize.sync({ force: true });
}
