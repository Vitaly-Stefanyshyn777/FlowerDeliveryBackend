import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './order.dto';
import { DateTime } from 'luxon';

@Injectable()
export class OrderService {
  private static readonly MAX_LIMIT = 100;

  constructor(private readonly prisma: PrismaService) {}

  async createOrder(dto: CreateOrderDto) {
    const shop = await this.prisma.shop.findUnique({
      where: { id: dto.shopId },
    });
    if (!shop) throw new NotFoundException('Shop not found');

    const deliveryAtUTC = dto.userTimezone
      ? DateTime.fromISO(dto.deliveryAt, { zone: dto.userTimezone })
          .toUTC()
          .toJSDate()
      : DateTime.fromISO(dto.deliveryAt).toUTC().toJSDate();

    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          shopId: dto.shopId,
          totalPrice: dto.totalPrice,
          deliveryAddr: dto.deliveryAddr,
          deliveryAtUTC,
          items: {
            create: dto.items.map((i) => ({
              productId: i.productId,
              name: i.name,
              qty: i.qty,
              price: i.price,
            })),
          },
        },
        include: { shop: true, items: true },
      });
      return order;
    });
  }

  async findAll(params: { page?: number; limit?: number }) {
    const page = Math.max(1, params.page || 1);
    const rawLimit = Math.max(1, params.limit || 20);
    const limit = Math.min(OrderService.MAX_LIMIT, rawLimit);
    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { shop: true, items: true },
      }),
      this.prisma.order.count(),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { shop: true, items: true },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
