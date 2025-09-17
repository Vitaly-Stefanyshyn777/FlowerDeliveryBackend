const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const IMAGES_BY_CATEGORY = {
  Рози: [
    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=900',
    'https://images.unsplash.com/photo-1504113888839-1c8eb50233d3?w=900',
  ],
  Тюльпани: [
    'https://images.unsplash.com/photo-1520637836862-4d197d17c88a?w=900',
    'https://images.unsplash.com/photo-1496062031456-07b8f162a322?w=900',
  ],
  Лілії: [
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=900',
    'https://images.unsplash.com/photo-1518005068251-37900150dfca?w=900',
  ],
  Хризантеми: [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=900',
    'https://images.unsplash.com/photo-1606923829579-0cb98105eaa0?w=900',
  ],
  Орхідеї: [
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=900',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=900',
  ],
  Букети: [
    'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=900',
    'https://images.unsplash.com/photo-1487537023671-8dce1a785863?w=900',
    'https://images.unsplash.com/photo-1525874684015-58379d421a52?w=900',
    'https://images.unsplash.com/photo-1495433324511-bf8e92934d90?w=900',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900',
    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=900',
    'https://images.unsplash.com/photo-1504113888839-1c8eb50233d3?w=900',
    'https://images.unsplash.com/photo-1520637836862-4d197d17c88a?w=900',
  ],
};

function pickImage(category) {
  const list = IMAGES_BY_CATEGORY[category] || IMAGES_BY_CATEGORY['Букети'];
  return list[Math.floor(Math.random() * list.length)];
}

async function main() {
  const products = await prisma.product.findMany({
    where: { OR: [{ imageUrl: null }, { imageUrl: '' }] },
  });
  for (const p of products) {
    const imageUrl = pickImage(p.category || 'Букети');
    await prisma.product.update({ where: { id: p.id }, data: { imageUrl } });
  }
  console.log(`✅ Updated ${products.length} products with placeholder images`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
