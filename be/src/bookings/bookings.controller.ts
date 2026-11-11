import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminKeyGuard } from '../common/admin-key.guard';
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

  @Get()
  @UseGuards(AdminKeyGuard)
  list() {
    return this.bookings.list();
  }

  @Patch(':id/status')
  @UseGuards(AdminKeyGuard)
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status?: unknown },
  ) {
    return this.bookings.updateStatus(id, String(body?.status ?? ''));
  }
}
