import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminKeyGuard } from '../common/admin-key.guard';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post() create(@Body() body: Parameters<OrdersService['create']>[0]) {
    return this.orders.create({ ...(body ?? {}), source: 'online' });
  }

  @Post('store')
  @UseGuards(AdminKeyGuard)
  createStoreOrder(@Body() body: Parameters<OrdersService['create']>[0]) {
    return this.orders.create({ ...(body ?? {}), source: 'store' });
  }

  @Get()
  @UseGuards(AdminKeyGuard)
  list() { return this.orders.list(); }

  @Get(':id')
  @UseGuards(AdminKeyGuard)
  getOne(@Param('id', ParseIntPipe) id: number) { return this.orders.getOne(id); }

  @Patch(':id/status')
  @UseGuards(AdminKeyGuard)
  updateStatus(@Param('id', ParseIntPipe) id: number, @Body() body: { status?: unknown }) { return this.orders.updateStatus(id, String(body?.status ?? '')); }
}
