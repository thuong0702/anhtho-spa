import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminKeyGuard } from '../common/admin-key.guard';
import { Category } from './category.entity';
import { Product } from './product.entity';
import { SpaService } from './spa-service.entity';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product, SpaService])],
  controllers: [CatalogController],
  providers: [CatalogService, AdminKeyGuard],
})
export class CatalogModule {}
