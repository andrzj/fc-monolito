import {
  Column,
  Model,
  PrimaryKey,
  Table,
  HasMany,
} from "sequelize-typescript";
import { OrderItemModel } from "./order-item.model";

@Table({
  tableName: "orders",
  timestamps: false,
})
export class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  clientId: string;

  @Column({ allowNull: false })
  clientName: string;

  @Column({ allowNull: false })
  clientEmail: string;

  @Column({ allowNull: false })
  clientAddress: string;

  @HasMany(() => OrderItemModel)
  items: OrderItemModel[];

  @Column({ allowNull: false })
  status: string;

  @Column({ allowNull: false })
  total: number;

  @Column({ allowNull: false })
  createdAt: Date;

  @Column({ allowNull: false })
  updatedAt: Date;
}
