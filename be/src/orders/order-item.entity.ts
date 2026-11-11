import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
  @Column({ name: 'order_id', type: 'bigint', unsigned: true }) orderId: number;
  @Column({ name: 'product_id', type: 'bigint', unsigned: true, nullable: true }) productId: number | null;
  @Column({ name: 'service_id', type: 'bigint', unsigned: true, nullable: true }) serviceId: number | null;
  @Column({ name: 'item_name', length: 180 }) itemName: string;
  @Column({ type: 'int', unsigned: true, default: 1 }) quantity: number;
  @Column({ name: 'unit_price', type: 'decimal', precision: 12, scale: 2 }) unitPrice: string;
  @Column({ name: 'discount_amount', type: 'decimal', precision: 12, scale: 2, default: 0 }) discountAmount: string;
  @Column({ name: 'line_total', type: 'decimal', precision: 12, scale: 2 }) lineTotal: string;
}
