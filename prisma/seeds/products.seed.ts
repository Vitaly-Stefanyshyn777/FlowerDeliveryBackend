import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const flowerData = [
  {
    name: 'Червоні троянди',
    price: 450,
    category: 'Рози',
    imageUrl:
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400',
  },
  {
    name: 'Білі троянди',
    price: 420,
    category: 'Рози',
    imageUrl:
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400',
  },
  {
    name: 'Рожеві троянди',
    price: 480,
    category: 'Рози',
    imageUrl:
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400',
  },
  {
    name: 'Жовті троянди',
    price: 460,
    category: 'Рози',
    imageUrl:
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400',
  },
  {
    name: 'Оранжеві троянди',
    price: 440,
    category: 'Рози',
    imageUrl:
      'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400',
  },
  {
    name: 'Червоні тюльпани',
    price: 380,
    category: 'Тюльпани',
    imageUrl:
      'https://images.unsplash.com/photo-1520637836862-4d197d17c88a?w=400',
  },
  {
    name: 'Жовті тюльпани',
    price: 350,
    category: 'Тюльпани',
    imageUrl:
      'https://images.unsplash.com/photo-1520637836862-4d197d17c88a?w=400',
  },
  {
    name: 'Білі тюльпани',
    price: 360,
    category: 'Тюльпани',
    imageUrl:
      'https://images.unsplash.com/photo-1520637836862-4d197d17c88a?w=400',
  },
  {
    name: 'Рожеві тюльпани',
    price: 370,
    category: 'Тюльпани',
    imageUrl:
      'https://images.unsplash.com/photo-1520637836862-4d197d17c88a?w=400',
  },
  {
    name: 'Фіолетові тюльпани',
    price: 390,
    category: 'Тюльпани',
    imageUrl:
      'https://images.unsplash.com/photo-1520637836862-4d197d17c88a?w=400',
  },
  {
    name: 'Білі лілії',
    price: 520,
    category: 'Лілії',
    imageUrl:
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
  },
  {
    name: 'Рожеві лілії',
    price: 500,
    category: 'Лілії',
    imageUrl:
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
  },
  {
    name: 'Оранжеві лілії',
    price: 510,
    category: 'Лілії',
    imageUrl:
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
  },
  {
    name: 'Червоні лілії',
    price: 530,
    category: 'Лілії',
    imageUrl:
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400',
  },
  {
    name: 'Білі хризантеми',
    price: 320,
    category: 'Хризантеми',
    imageUrl:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
  },
  {
    name: 'Рожеві хризантеми',
    price: 300,
    category: 'Хризантеми',
    imageUrl:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
  },
  {
    name: 'Жовті хризантеми',
    price: 310,
    category: 'Хризантеми',
    imageUrl:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
  },
  {
    name: 'Фіолетові хризантеми',
    price: 330,
    category: 'Хризантеми',
    imageUrl:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
  },
  {
    name: 'Сині орхідеї',
    price: 680,
    category: 'Орхідеї',
    imageUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
  },
  {
    name: 'Білі орхідеї',
    price: 650,
    category: 'Орхідеї',
    imageUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
  },
];

export async function seedProducts() {
  console.log('🌻 Seeding products...');

  for (const flower of flowerData) {
    await prisma.product.upsert({
      where: { name: flower.name },
      update: {},
      create: {
        name: flower.name,
        price: flower.price,
        category: flower.category,
        imageUrl: flower.imageUrl,
        description: `Красиві ${flower.name.toLowerCase()} для особливих моментів`,
        isActive: true,
      },
    });
  }

  console.log(`✅ Seeded ${flowerData.length} products`);
}

export default seedProducts;
