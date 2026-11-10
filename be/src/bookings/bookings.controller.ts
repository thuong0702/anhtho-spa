import { Body, Controller, Post } from '@nestjs/common';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Post()
  create(@Body() body: unknown) {
    return this.bookings.create(
      body && typeof body === 'object'
        ? (body as {
            name?: unknown;
            phone?: unknown;
            service?: unknown;
            appointmentAt?: unknown;
          })
        : {},
    );
  }
}
