import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { OrderItemModel } from "./order-item.model";
import { OrderModel } from "./order.model";

export default class CheckoutRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    await OrderModel.create(
      {
        id: order.id.id,
        clientId: order.client.id.id,
        clientName: order.client.name,
        clientEmail: order.client.email,
        clientAddress: order.client.address,
        status: "pending",
        total: order.total,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: order.products.map((product) => ({
          id: product.id.id,
          productId: product.id.id,
          name: product.name,
          salesPrice: product.salesPrice,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async findOrder(id: string): Promise<Order | null> {
    const orderModel = await OrderModel.findOne({
      where: { id },
      include: [{ model: OrderItemModel }],
    });

    if (!orderModel) {
      return null;
    }

    const client = new Client({
      id: new Id(orderModel.clientId),
      name: orderModel.clientName,
      email: orderModel.clientEmail,
      address: orderModel.clientAddress,
    });

    const products = orderModel.items.map(
      (item) =>
        new Product({
          id: new Id(item.productId),
          name: item.name,
          description: "",
          salesPrice: item.salesPrice,
        })
    );

    return new Order({
      id: new Id(orderModel.id),
      client,
      products,
      status: orderModel.status,
    });
  }
}
