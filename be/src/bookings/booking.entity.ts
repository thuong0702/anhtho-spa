import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

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
}
