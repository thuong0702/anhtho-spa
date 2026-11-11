import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { Product } from './product.entity';
import { SpaService } from './spa-service.entity';

type CatalogInput = Record<string, unknown>;
const text = (value: unknown, field: string, max: number) => {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > max) throw new BadRequestException(`${field} không hợp lệ.`);
  return value.trim();
};
const optionalText = (value: unknown, field: string, max: number) => value == null || value === '' ? null : text(value, field, max);
const amount = (value: unknown, field: string) => {
  const result = Number(value);
  if (!Number.isFinite(result) || result < 0) throw new BadRequestException(`${field} không hợp lệ.`);
  return result;
};

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Category) private readonly categories: Repository<Category>,
    @InjectRepository(Product) private readonly products: Repository<Product>,
    @InjectRepository(SpaService) private readonly services: Repository<SpaService>,
  ) {}

  listCategories(type?: string) {
    if (type && type !== 'product' && type !== 'service') throw new BadRequestException('Loại danh mục không hợp lệ.');
    const categoryType = type as 'product' | 'service' | undefined;
    return this.categories.find({ where: { ...(categoryType ? { type: categoryType } : {}), isActive: true }, order: { name: 'ASC' } });
  }
  async createCategory(input: CatalogInput) {
    const type = input.type;
    if (type !== 'product' && type !== 'service') throw new BadRequestException('Loại danh mục phải là product hoặc service.');
    const name = text(input.name, 'Tên danh mục', 100);
    const slug = (typeof input.slug === 'string' ? input.slug : name).trim().toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 120);
    if (!slug) throw new BadRequestException('Slug danh mục không hợp lệ.');
    return this.categories.save(this.categories.create({ type, name, slug, description: optionalText(input.description, 'Mô tả', 500), isActive: true }));
  }

  listProducts() { return this.products.find({ where: { status: 'active' }, order: { createdAt: 'DESC' } }); }
  async saveProduct(input: CatalogInput, id?: number) {
    const entity = id ? await this.products.findOneBy({ id }) : this.products.create();
    if (!entity) throw new NotFoundException('Không tìm thấy sản phẩm.');
    const categoryId = input.categoryId == null || input.categoryId === '' ? null : Number(input.categoryId);
    if (categoryId !== null) {
      const category = await this.categories.findOneBy({ id: categoryId, type: 'product' });
      if (!category) throw new BadRequestException('Danh mục sản phẩm không tồn tại.');
    }
    entity.categoryId = categoryId;
    entity.name = text(input.name ?? entity.name, 'Tên sản phẩm', 180);
    entity.description = optionalText(input.description, 'Mô tả', 60000);
    entity.price = String(amount(input.price ?? entity.price, 'Giá'));
    entity.imageUrl = optionalText(input.imageUrl, 'Ảnh', 1000);
    entity.sku = optionalText(input.sku, 'SKU', 60);
    entity.stockQuantity = Math.floor(amount(input.stockQuantity ?? entity.stockQuantity ?? 0, 'Tồn kho'));
    entity.lowStockThreshold = Math.floor(amount(input.lowStockThreshold ?? entity.lowStockThreshold ?? 5, 'Ngưỡng tồn kho'));
    if (input.status !== undefined) {
      if (!['active', 'hidden', 'discontinued'].includes(String(input.status))) throw new BadRequestException('Trạng thái sản phẩm không hợp lệ.');
      entity.status = String(input.status);
    }
    return this.products.save(entity);
  }

  listServices() { return this.services.find({ where: { status: 'active' }, order: { createdAt: 'DESC' } }); }
  async saveService(input: CatalogInput, id?: number) {
    const entity = id ? await this.services.findOneBy({ id }) : this.services.create();
    if (!entity) throw new NotFoundException('Không tìm thấy dịch vụ.');
    const categoryId = input.categoryId == null || input.categoryId === '' ? null : Number(input.categoryId);
    if (categoryId !== null && !await this.categories.findOneBy({ id: categoryId, type: 'service' })) throw new BadRequestException('Danh mục dịch vụ không tồn tại.');
    entity.categoryId = categoryId;
    entity.name = text(input.name ?? entity.name, 'Tên dịch vụ', 180);
    entity.description = optionalText(input.description, 'Mô tả', 60000);
    entity.price = String(amount(input.price ?? entity.price, 'Giá'));
    entity.durationMinutes = Math.floor(amount(input.durationMinutes ?? entity.durationMinutes, 'Thời lượng'));
    if (!entity.durationMinutes) throw new BadRequestException('Thời lượng phải lớn hơn 0.');
    entity.imageUrl = optionalText(input.imageUrl, 'Ảnh', 1000);
    if (input.status !== undefined) {
      if (!['active', 'hidden', 'paused'].includes(String(input.status))) throw new BadRequestException('Trạng thái dịch vụ không hợp lệ.');
      entity.status = String(input.status);
    }
    return this.services.save(entity);
  }
}
