const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const bouquets = [
    {
      name: 'Букет “Червона любов”',
      description: '11 червоних троянд, евкаліпт, декоративна зелень',
      price: 1290,
      category: 'Букети',
      imageUrl:
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900',
    },
    {
      name: 'Букет “Ніжність”',
      description: 'Піоноподібні троянди, гіпсофіла, зелені акценти',
      price: 1490,
      category: 'Букети',
      imageUrl:
        'https://images.unsplash.com/photo-1495433324511-bf8e92934d90?w=900',
    },
    {
      name: 'Букет “Весняний настрій”',
      description: 'Тюльпани мікс 25 шт',
      price: 990,
      category: 'Букети',
      imageUrl:
        'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=900',
    },
    {
      name: 'Букет “Білий шовк”',
      description: 'Білі лілії та троянди, зелень',
      price: 1590,
      category: 'Букети',
      imageUrl:
        'https://images.unsplash.com/photo-1487537023671-8dce1a785863?w=900',
    },
    {
      name: 'Букет “Лавандовий бриз”',
      description: 'Лаванда, рожеві троянди, матіола',
      price: 1390,
      category: 'Букети',
      imageUrl:
        'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=900',
    },
  ];

  for (const b of bouquets) {
    await prisma.product.upsert({
      where: { name: b.name },
      update: b,
      create: { ...b, isActive: true },
    });
  }

  console.log('✅ Seeded bouquets');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
