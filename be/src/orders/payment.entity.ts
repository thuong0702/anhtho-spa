import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
  @Column({ name: 'order_id', type: 'bigint', unsigned: true }) orderId: number;
  @Column({ type: 'enum', enum: ['cod', 'bank_transfer', 'card', 'e_wallet', 'cash'] }) method: string;
  @Column({ type: 'decimal', precision: 12, scale: 2 }) amount: string;
  @Column({ type: 'enum', enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' }) status: string;
  @Column({ name: 'transaction_reference', type: 'varchar', length: 120, nullable: true }) transactionReference: string | null;
  @Column({ name: 'paid_at', type: 'datetime', nullable: true }) paidAt: Date | null;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
