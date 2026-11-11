import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'customer_id', type: 'bigint', unsigned: true, nullable: true })
  customerId: number | null;

  @Column({ name: 'service_id', type: 'bigint', unsigned: true, nullable: true })
  serviceId: number | null;

  @Column({ name: 'staff_id', type: 'bigint', unsigned: true, nullable: true })
  staffId: number | null;

  @Column({ length: 120 })
  name: string;

  @Column({ length: 30 })
  phone: string;

  @Column({ length: 120 })
  service: string;

  @Column({ type: 'datetime' })
  appointmentAt: Date;

  @Column({ default: 'pending', length: 20 })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
