import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const categorySlug = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : null;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : null;
    const sort = searchParams.get('sort') || 'newest';

    const where: any = {};

    // Search query filter
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    // Category filter (includes subcategories)
    if (categorySlug) {
      const category = await db.category.findUnique({
        where: { slug: categorySlug },
        include: { children: true },
      });

      if (category) {
        const categoryIds = [category.id, ...category.children.map((c) => c.id)];
        where.categoryId = { in: categoryIds };
      } else {
        return NextResponse.json({ products: [], brands: [], maxDbPrice: 0 });
      }
    }

    // Brand filter
    if (brand) {
      where.brand = brand;
    }

    // Price range filters
    const priceFilters: any[] = [];
    if (minPrice !== null) {
      priceFilters.push({
        OR: [
          { AND: [{ discountPrice: { not: null } }, { discountPrice: { gte: minPrice } }] },
          { AND: [{ discountPrice: null }, { price: { gte: minPrice } }] },
        ],
      });
    }
    if (maxPrice !== null) {
      priceFilters.push({
        OR: [
          { AND: [{ discountPrice: { not: null } }, { discountPrice: { lte: maxPrice } }] },
          { AND: [{ discountPrice: null }, { price: { lte: maxPrice } }] },
        ],
      });
    }

    if (priceFilters.length > 0) {
      if (where.AND) {
        where.AND.push(...priceFilters);
      } else {
        where.AND = priceFilters;
      }
    }

    // Sorting options
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') {
      orderBy = { price: 'asc' };
    } else if (sort === 'price_desc') {
      orderBy = { price: 'desc' };
    } else if (sort === 'rating') {
      orderBy = { rating: 'desc' };
    }

    // Execute queries
    const products = await db.product.findMany({
      where,
      orderBy,
      include: { category: true },
    });

    const allProductsForBrands = await db.product.findMany({
      where: categorySlug ? { category: { slug: categorySlug } } : {},
      select: { brand: true },
    });
    const brands = Array.from(new Set(allProductsForBrands.map((p) => p.brand).filter(Boolean)));

    const maxProductPrice = await db.product.findFirst({
      orderBy: { price: 'desc' },
      select: { price: true },
    });
    const maxDbPrice = maxProductPrice ? maxProductPrice.price : 20000000;

    return NextResponse.json({
      products,
      brands,
      maxDbPrice,
    });
  } catch (error) {
    console.error('Fetch products error:', error);
    return NextResponse.json({ error: 'Mahsulotlarni yuklashda xatolik yuz berdi' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Ruxsat etilmagan' }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, price, discountPrice, images, stock, brand, categoryId } = body;

    if (!name || !price || !stock || !categoryId) {
      return NextResponse.json(
        { error: 'Nomi, narxi, zaxirasi va kategoriyasi majburiy' },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        images: images || '/images/placeholder.jpg',
        stock: parseInt(stock),
        brand: brand || null,
        categoryId,
        rating: 5.0, // default rating
      },
      include: { category: true },
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Mahsulot yaratishda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
