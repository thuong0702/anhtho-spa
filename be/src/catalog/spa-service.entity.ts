import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('services')
export class SpaService {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true }) id: number;
  @Column({ name: 'category_id', type: 'bigint', unsigned: true, nullable: true }) categoryId: number | null;
  @Column({ length: 180 }) name: string;
  @Column({ type: 'text', nullable: true }) description: string | null;
  @Column({ name: 'duration_minutes', type: 'smallint', unsigned: true }) durationMinutes: number;
  @Column({ type: 'decimal', precision: 12, scale: 2 }) price: string;
  @Column({ name: 'image_url', type: 'varchar', length: 1000, nullable: true }) imageUrl: string | null;
  @Column({ type: 'enum', enum: ['active', 'hidden', 'paused'], default: 'active' }) status: string;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
