/* eslint-disable */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Create Admin and User
  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const userPasswordHash = await bcrypt.hash('user123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@uzmarket.uz',
      passwordHash: adminPasswordHash,
      phone: '+998901234567',
      address: 'Toshkent shahar, Chilonzor tumani',
      role: 'ADMIN',
    }
  });

  const user = await prisma.user.create({
    data: {
      name: 'Eldor Alimov',
      email: 'user@uzmarket.uz',
      passwordHash: userPasswordHash,
      phone: '+998937654321',
      address: 'Toshkent shahar, Yunusobod tumani',
      role: 'USER',
    }
  });

  // Create Categories
  const electronics = await prisma.category.create({
    data: { name: 'Elektronika', slug: 'elektronika' }
  });

  const phones = await prisma.category.create({
    data: { name: 'Smartfonlar', slug: 'smartfonlar', parentId: electronics.id }
  });

  const laptops = await prisma.category.create({
    data: { name: 'Noutbuklar', slug: 'noutbuklar', parentId: electronics.id }
  });

  const appliances = await prisma.category.create({
    data: { name: 'Maishiy texnika', slug: 'maishiy-texnika' }
  });

  // Create Products
  const s24 = await prisma.product.create({
    data: {
      name: 'Samsung Galaxy S24 Ultra 12/512GB',
      description: 'Samsung-ning eng yangi va kuchli flagman smartfoni. 200MP kamera, Galaxy AI imkoniyatlari, titan korpus va yorqin 6.8 dyuymli ekran.',
      price: 15500000,
      discountPrice: 14500000,
      images: '/images/products/s24_1.png',
      stock: 15,
      brand: 'Samsung',
      rating: 4.8,
      categoryId: phones.id,
    }
  });

  const iphone15 = await prisma.product.create({
    data: {
      name: 'iPhone 15 Pro Max 256GB',
      description: 'Apple-ning eng mashhur smartfoni. Titan dizayn, A17 Pro chipi, 5x optik yaqinlashtiruvchi kamera va USB-C porti.',
      price: 18200000,
      discountPrice: 17500000,
      images: '/images/products/iphone15_1.png',
      stock: 8,
      brand: 'Apple',
      rating: 4.9,
      categoryId: phones.id,
    }
  });

  const macbook = await prisma.product.create({
    data: {
      name: 'MacBook Air 13 M3 8/256GB',
      description: 'Super-kuchli va yupqa noutbuk. Apple M3 chipi, batareyaning 18 soatgacha ishlashi, yorqin Retina ekran.',
      price: 14200000,
      discountPrice: 13800000,
      images: '/images/products/macbook_1.png',
      stock: 5,
      brand: 'Apple',
      rating: 4.7,
      categoryId: laptops.id,
    }
  });

  const washingMachine = await prisma.product.create({
    data: {
      name: 'LG Kir yuvish mashinasi 7kg',
      description: 'Inverter Direct Drive motorli, bug‘ bilan yuvish funksiyasiga ega tejamkor va jim ishlaydigan kir yuvish mashinasi.',
      price: 5200000,
      discountPrice: 4800000,
      images: '/images/products/lg_wash_1.png',
      stock: 12,
      brand: 'LG',
      rating: 4.6,
      categoryId: appliances.id,
    }
  });

  // Create Reviews for products
  await prisma.review.create({
    data: {
      productId: s24.id,
      userId: user.id,
      userName: user.name,
      rating: 5,
      comment: 'Juda ajoyib telefon! Ayniqsa kamerasi va AI funksiyalari menga juda ma‘qul keldi. Batareyasi ham 2 kunga yetadi.',
    }
  });

  await prisma.review.create({
    data: {
      productId: s24.id,
      userName: 'Mehmon Foydalanuvchi',
      rating: 4,
      comment: 'Telefon yaxshi, lekin narxi biroz balandroq. Qolgan jihatlariga gap yo‘q.',
    }
  });

  console.log('Database successfully seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
