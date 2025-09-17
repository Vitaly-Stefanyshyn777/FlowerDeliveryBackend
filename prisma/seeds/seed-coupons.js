// Simple JS seeder to avoid ts-node/runtime issues
// const { PrismaClient } = require('@prisma/client');
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const coupons = [
    {
      code: 'WELCOME10',
      description: '-10% на перше замовлення',
      discountPercent: 10,
      imageUrl:
        'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800',
      isActive: true,
    },
    {
      code: 'FREESHIP',
      description: 'Безкоштовна доставка (еквівалент 100 грн)',
      discountAmount: 100,
      imageUrl:
        'https://images.unsplash.com/photo-1520637836862-4d197d17c88a?w=800',
      isActive: true,
    },
    {
      code: 'ROSES15',
      description: '-15% на категорію Рози',
      discountPercent: 15,
      appliesToCategory: 'Рози',
      imageUrl:
        'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800',
      isActive: true,
    },
  ];

  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: c,
      create: c,
    });
  }

  console.log('✅ Seeded demo coupons');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
