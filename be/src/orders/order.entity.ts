import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
  @Column({ name: 'order_code', length: 40 }) orderCode: string;
  @Column({ type: 'enum', enum: ['online', 'store'], default: 'online' }) source: 'online' | 'store';
  @Column({ name: 'customer_id', type: 'bigint', unsigned: true, nullable: true }) customerId: number | null;
  @Column({ name: 'staff_id', type: 'bigint', unsigned: true, nullable: true }) staffId: number | null;
  @Column({ name: 'promotion_id', type: 'bigint', unsigned: true, nullable: true }) promotionId: number | null;
  @Column({ name: 'customer_name', length: 120 }) customerName: string;
  @Column({ name: 'customer_phone', length: 30 }) customerPhone: string;
  @Column({ name: 'customer_email', type: 'varchar', length: 255, nullable: true }) customerEmail: string | null;
  @Column({ name: 'shipping_address', type: 'varchar', length: 500, nullable: true }) shippingAddress: string | null;
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 }) subtotal: string;
  @Column({ name: 'discount_amount', type: 'decimal', precision: 12, scale: 2, default: 0 }) discountAmount: string;
  @Column({ name: 'shipping_fee', type: 'decimal', precision: 12, scale: 2, default: 0 }) shippingFee: string;
  @Column({ name: 'total_amount', type: 'decimal', precision: 12, scale: 2, default: 0 }) totalAmount: string;
  @Column({ type: 'enum', enum: ['pending', 'confirmed', 'preparing', 'shipping', 'completed', 'cancelled', 'refunded'], default: 'pending' }) status: string;
  @Column({ type: 'text', nullable: true }) notes: string | null;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
