import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
  @Column({ name: 'category_id', type: 'bigint', unsigned: true, nullable: true }) categoryId: number | null;
  @Column({ type: 'varchar', length: 60, nullable: true }) sku: string | null;
  @Column({ length: 180 }) name: string;
  @Column({ type: 'text', nullable: true }) description: string | null;
  @Column({ type: 'decimal', precision: 12, scale: 2 }) price: string;
  @Column({ name: 'image_url', type: 'varchar', length: 1000, nullable: true }) imageUrl: string | null;
  @Column({ name: 'stock_quantity', type: 'int', unsigned: true, default: 0 }) stockQuantity: number;
  @Column({ name: 'low_stock_threshold', type: 'int', unsigned: true, default: 5 }) lowStockThreshold: number;
  @Column({ type: 'enum', enum: ['active', 'hidden', 'discontinued'], default: 'active' }) status: string;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
