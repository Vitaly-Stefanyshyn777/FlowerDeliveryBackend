import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedUsers() {
  console.log('👤 Seeding users...');

  // Додати базових користувачів якщо потрібно
  console.log('✅ Users seeded');
}

export default seedUsers;
