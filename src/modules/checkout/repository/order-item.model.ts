import {
  Column,
  Model,
  PrimaryKey,
  Table,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { OrderModel } from "./order.model";

@Table({
  tableName: "order_items",
  timestamps: false,
})
export class OrderItemModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @ForeignKey(() => OrderModel)
  @Column({ allowNull: false })
  orderId: string;

  @BelongsTo(() => OrderModel)
  order: OrderModel;

  @Column({ allowNull: false })
  productId: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  salesPrice: number;
}
