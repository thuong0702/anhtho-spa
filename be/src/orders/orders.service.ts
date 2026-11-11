import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Product } from '../catalog/product.entity';
import { SpaService } from '../catalog/spa-service.entity';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from './payment.entity';

type CreateOrderInput = {
  source?: unknown;
  customerId?: unknown;
  staffId?: unknown;
  customerName?: unknown;
  customerPhone?: unknown;
  customerEmail?: unknown;
  shippingAddress?: unknown;
  notes?: unknown;
  paymentMethod?: unknown;
  items?: unknown;
};
type InputLine = { productId?: unknown; serviceId?: unknown; quantity?: unknown };
const validPhone = (phone: string) => /^\+?[0-9 .()-]{9,20}$/.test(phone);

@Injectable()
export class OrdersService {
  constructor(private readonly dataSource: DataSource) {}

  async create(input: CreateOrderInput) {
    const customerName = typeof input.customerName === 'string' ? input.customerName.trim() : '';
    const customerPhone = typeof input.customerPhone === 'string' ? input.customerPhone.trim() : '';
    const source = input.source === 'store' ? 'store' : 'online';
    const lines = Array.isArray(input.items) ? input.items as InputLine[] : [];
    if (customerName.length < 2 || customerName.length > 120) throw new BadRequestException('Họ tên khách hàng không hợp lệ.');
    if (!validPhone(customerPhone)) throw new BadRequestException('Số điện thoại không hợp lệ.');
    if (!lines.length || lines.length > 50) throw new BadRequestException('Đơn hàng cần có từ 1 đến 50 sản phẩm hoặc dịch vụ.');
    if (source === 'online' && !input.shippingAddress) throw new BadRequestException('Vui lòng nhập địa chỉ giao hàng.');
    const method = input.paymentMethod == null ? (source === 'online' ? 'cod' : 'cash') : String(input.paymentMethod);
    if (!['cod', 'bank_transfer', 'card', 'e_wallet', 'cash'].includes(method)) throw new BadRequestException('Phương thức thanh toán không hợp lệ.');

    const orderId = await this.dataSource.transaction(async (manager) => {
      const items: OrderItem[] = [];
      let subtotal = 0;
      for (const line of lines) {
        const productId = line.productId == null ? null : Number(line.productId);
        const serviceId = line.serviceId == null ? null : Number(line.serviceId);
        const quantity = Number(line.quantity ?? 1);
        if ((productId === null) === (serviceId === null) || !Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
          throw new BadRequestException('Một dòng đơn hàng có mã sản phẩm/dịch vụ hoặc số lượng không hợp lệ.');
        }
        let name: string;
        let price: number;
        if (productId !== null) {
          const product = await manager.getRepository(Product).findOneBy({ id: productId, status: 'active' });
          if (!product) throw new NotFoundException(`Không tìm thấy sản phẩm #${productId}.`);
          if (source === 'online' && Number(product.stockQuantity) < quantity) throw new BadRequestException(`Sản phẩm “${product.name}” không đủ tồn kho.`);
          name = product.name;
          price = Number(product.price);
          if (source === 'online') {
            const result = await manager.query('UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ? AND stock_quantity >= ?', [quantity, productId, quantity]);
            if (!result.affectedRows) throw new BadRequestException(`Sản phẩm “${product.name}” vừa hết hàng.`);
          }
          items.push(manager.create(OrderItem, { orderId: 0, productId, serviceId: null, itemName: name, quantity, unitPrice: String(price), discountAmount: '0', lineTotal: String(price * quantity) }));
        } else {
          const service = await manager.getRepository(SpaService).findOneBy({ id: serviceId as number, status: 'active' });
          if (!service) throw new NotFoundException(`Không tìm thấy dịch vụ #${serviceId}.`);
          name = service.name;
          price = Number(service.price);
          items.push(manager.create(OrderItem, { orderId: 0, productId: null, serviceId, itemName: name, quantity, unitPrice: String(price), discountAmount: '0', lineTotal: String(price * quantity) }));
        }
        subtotal += price * quantity;
      }

      const order = await manager.save(Order, manager.create(Order, {
        orderCode: `AT${Date.now()}${Math.floor(Math.random() * 900 + 100)}`,
        source,
        // Until customer JWT authentication is implemented, never trust ids
        // supplied by a public client.
        customerId: null,
        staffId: null,
        promotionId: null,
        customerName,
        customerPhone,
        customerEmail: typeof input.customerEmail === 'string' ? input.customerEmail.trim() || null : null,
        shippingAddress: typeof input.shippingAddress === 'string' ? input.shippingAddress.trim() || null : null,
        subtotal: String(subtotal),
        discountAmount: '0',
        shippingFee: '0',
        totalAmount: String(subtotal),
        status: 'pending',
        notes: typeof input.notes === 'string' ? input.notes.trim() || null : null,
      }));
      for (const item of items) item.orderId = order.id;
      await manager.save(OrderItem, items);
      await manager.save(Payment, manager.create(Payment, { orderId: order.id, method, amount: String(subtotal), status: method === 'cod' || method === 'cash' ? 'pending' : 'pending', transactionReference: null, paidAt: null }));
      return order.id;
    });
    return this.getOne(orderId);
  }

  async getOne(id: number) {
    const order = await this.dataSource.getRepository(Order).findOneBy({ id });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng.');
    const [items, payments] = await Promise.all([
      this.dataSource.getRepository(OrderItem).findBy({ orderId: id }),
      this.dataSource.getRepository(Payment).findBy({ orderId: id }),
    ]);
    return { ...order, items, payments };
  }

  async list() {
    const orders = await this.dataSource.getRepository(Order).find({ order: { createdAt: 'DESC' }, take: 200 });
    return Promise.all(orders.map((order) => this.getOne(order.id)));
  }

  async updateStatus(id: number, status: string) {
    const allowed = ['pending', 'confirmed', 'preparing', 'shipping', 'completed', 'cancelled', 'refunded'];
    if (!allowed.includes(status)) throw new BadRequestException('Trạng thái đơn hàng không hợp lệ.');
    const orders = this.dataSource.getRepository(Order);
    const order = await orders.findOneBy({ id });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng.');
    order.status = status;
    await orders.save(order);
    return this.getOne(id);
  }
}
