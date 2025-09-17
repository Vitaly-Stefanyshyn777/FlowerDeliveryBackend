import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShopService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(id: string) {
    return this.prisma.shop.findUnique({ where: { id } });
  }

  async ensureExists(id: string) {
    const shop = await this.findOne(id);
    if (!shop) throw new NotFoundException('Shop not found');
    return shop;
  }
}
