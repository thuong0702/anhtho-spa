import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';

type CreateBookingInput = {
  name?: unknown;
  phone?: unknown;
  service?: unknown;
  appointmentAt?: unknown;
};

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookings: Repository<Booking>,
  ) {}

  async create(input: CreateBookingInput) {
    const name = typeof input?.name === 'string' ? input.name.trim() : '';
    const phone = typeof input?.phone === 'string' ? input.phone.trim() : '';
    const service =
      typeof input?.service === 'string' ? input.service.trim() : '';
    const appointmentAt =
      typeof input?.appointmentAt === 'string'
        ? new Date(input.appointmentAt)
        : new Date(Number.NaN);

    if (name.length < 2 || name.length > 120) {
      throw new BadRequestException('Vui lòng nhập họ tên từ 2 đến 120 ký tự.');
    }
    if (!/^\+?[0-9 .()-]{9,20}$/.test(phone)) {
      throw new BadRequestException('Số điện thoại chưa hợp lệ.');
    }
    if (service.length < 2 || service.length > 120) {
      throw new BadRequestException('Vui lòng chọn dịch vụ cần đặt.');
    }
    if (
      Number.isNaN(appointmentAt.getTime()) ||
      appointmentAt.getTime() < Date.now()
    ) {
      throw new BadRequestException('Vui lòng chọn ngày giờ trong tương lai.');
    }

    const booking = await this.bookings.save(
      this.bookings.create({
        name,
        phone,
        service,
        appointmentAt,
        customerId: null,
        serviceId: null,
        staffId: null,
        notes: null,
      }),
    );

    return {
      id: booking.id,
      status: booking.status,
      appointmentAt: booking.appointmentAt,
    };
  }

  list() {
    return this.bookings.find({ order: { appointmentAt: 'DESC' } });
  }

  async updateStatus(id: number, status: string) {
    const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      throw new BadRequestException('Trạng thái lịch hẹn không hợp lệ.');
    }
    const booking = await this.bookings.findOneBy({ id });
    if (!booking) throw new NotFoundException('Không tìm thấy lịch hẹn.');
    booking.status = status;
    return this.bookings.save(booking);
  }
}
