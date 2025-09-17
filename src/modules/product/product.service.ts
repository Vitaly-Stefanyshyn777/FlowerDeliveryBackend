import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from './product.dto';

@Injectable()
export class ProductService {
  private static readonly MAX_LIMIT = 100;

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: dto,
    });
  }

  async findAll(query: ProductQueryDto) {
    const page = Math.max(1, query.page || 1);
    const rawLimit = Math.max(1, query.limit || 20);
    const limit = Math.min(ProductService.MAX_LIMIT, rawLimit);
    const skip = (page - 1) * limit;

    const where: any = {};

    // Нормалізація категорій: category=.. або categories[]=..
    const categories: string[] = Array.isArray((query as any).category)
      ? ((query as any).category as string[])
      : query.categories || (query.category ? [query.category] : []);

    if (categories.length > 0) {
      where.category = { in: categories };
    }

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    if (query.isActive !== undefined) where.isActive = query.isActive;
    if (query.isHit !== undefined) where.isHit = query.isHit;
    if (query.isNew !== undefined) where.isNew = query.isNew;
    const requireDiscount = query.hasDiscount === true;
    if (requireDiscount) {
      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : []),
        { priceOriginal: { not: null } },
      ];
    }

    // Сортування
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';
    let orderBy: any = {};
    if (sortBy === 'discountPercent') {
      // Емулюємо сортування за знижкою:
      // Спочатку ті, де priceOriginal не null і > price, далі за співвідношенням price/priceOriginal
      orderBy = [
        { priceOriginal: 'desc' },
        { price: sortOrder === 'asc' ? 'desc' : 'asc' },
      ];
    } else {
      orderBy[sortBy] = sortOrder;
    }

    const [rawItems, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.product.count({ where }),
    ]);

    // Додаткове фільтрування за знижкою (priceOriginal > price), якщо потрібно
    const filtered = requireDiscount
      ? rawItems.filter(
          (p) => p.priceOriginal != null && p.priceOriginal > p.price,
        )
      : rawItems;

    const mapped = filtered.map((p) => ({
      ...p,
      discountPercent:
        p.priceOriginal && p.priceOriginal > p.price
          ? Math.round((1 - p.price / p.priceOriginal) * 100)
          : 0,
    }));

    return {
      items: mapped,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      sortBy,
      sortOrder,
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    return this.prisma.product.delete({
      where: { id },
    });
  }

  async getCategories() {
    const categories = await this.prisma.product.findMany({
      select: { category: true },
      distinct: ['category'],
      where: { category: { not: null } },
    });
    return categories.map((c) => c.category).filter(Boolean);
  }
}
