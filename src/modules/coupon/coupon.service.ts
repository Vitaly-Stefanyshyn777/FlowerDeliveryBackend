import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CouponService {
  constructor(private readonly prisma: PrismaService) {}

  async listActive() {
    const now = new Date();
    return this.prisma.coupon.findMany({
      where: {
        isActive: true,
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
        ],
      },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        code: true,
        description: true,
        discountPercent: true,
        discountAmount: true,
        startsAt: true,
        endsAt: true,
        imageUrl: true,
        appliesToProductId: true,
        appliesToCategory: true,
      },
    });
  }

  async validate(code: string, total?: number) {
    const now = new Date();
    const coupon = await this.prisma.coupon.findUnique({ where: { code } });
    if (!coupon || !coupon.isActive)
      throw new NotFoundException('Coupon not found');
    if (coupon.startsAt && coupon.startsAt > now)
      throw new BadRequestException('Coupon not started');
    if (coupon.endsAt && coupon.endsAt < now)
      throw new BadRequestException('Coupon expired');
    if (
      coupon.maxRedemptions &&
      coupon.usedRedemptions >= coupon.maxRedemptions
    )
      throw new BadRequestException('Coupon usage limit reached');
    if (coupon.minOrderTotal && (total ?? 0) < coupon.minOrderTotal)
      throw new BadRequestException('Order total is below minimum');

    const discountPercent = coupon.discountPercent || 0;
    const discountAmount = coupon.discountAmount || 0;
    return { ...coupon, discountPercent, discountAmount };
  }
}
