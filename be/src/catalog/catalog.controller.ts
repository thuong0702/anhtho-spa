import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AdminKeyGuard } from '../common/admin-key.guard';
import { CatalogService } from './catalog.service';

@Controller()
export class CatalogController {
  constructor(private readonly catalog: CatalogService) {}

  @Get('categories') categories(@Query('type') type?: string) { return this.catalog.listCategories(type); }
  @Post('categories') @UseGuards(AdminKeyGuard) createCategory(@Body() body: Record<string, unknown>) { return this.catalog.createCategory(body); }

  @Get('products') products() { return this.catalog.listProducts(); }
  @Post('products') @UseGuards(AdminKeyGuard) createProduct(@Body() body: Record<string, unknown>) { return this.catalog.saveProduct(body); }
  @Put('products/:id') @UseGuards(AdminKeyGuard) updateProduct(@Param('id', ParseIntPipe) id: number, @Body() body: Record<string, unknown>) { return this.catalog.saveProduct(body, id); }

  @Get('services') services() { return this.catalog.listServices(); }
  @Post('services') @UseGuards(AdminKeyGuard) createService(@Body() body: Record<string, unknown>) { return this.catalog.saveService(body); }
  @Put('services/:id') @UseGuards(AdminKeyGuard) updateService(@Param('id', ParseIntPipe) id: number, @Body() body: Record<string, unknown>) { return this.catalog.saveService(body, id); }
}
