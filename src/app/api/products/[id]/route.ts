import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Ruxsat etilmagan' }, { status: 403 });
    }

    const resolvedParams = await params;
    const productId = resolvedParams.id;
    const body = await request.json();
    const { name, description, price, discountPrice, images, stock, brand, categoryId } = body;

    // Check if product exists
    const existingProduct = await db.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Mahsulot topilmadi' }, { status: 404 });
    }

    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: {
        name: name !== undefined ? name : existingProduct.name,
        description: description !== undefined ? description : existingProduct.description,
        price: price !== undefined ? parseFloat(price) : existingProduct.price,
        discountPrice: discountPrice !== undefined ? (discountPrice ? parseFloat(discountPrice) : null) : existingProduct.discountPrice,
        images: images !== undefined ? images : existingProduct.images,
        stock: stock !== undefined ? parseInt(stock) : existingProduct.stock,
        brand: brand !== undefined ? brand : existingProduct.brand,
        categoryId: categoryId !== undefined ? categoryId : existingProduct.categoryId,
      },
      include: { category: true },
    });

    return NextResponse.json({ product: updatedProduct });
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Mahsulotni yangilashda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Ruxsat etilmagan' }, { status: 403 });
    }

    const resolvedParams = await params;
    const productId = resolvedParams.id;

    // Check if product exists
    const existingProduct = await db.product.findUnique({
      where: { id: productId },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Mahsulot topilmadi' }, { status: 404 });
    }

    // Delete related items first (Review, OrderItem) to avoid foreign key constraint errors
    await db.review.deleteMany({ where: { productId } });
    await db.orderItem.deleteMany({ where: { productId } });

    // Delete product
    await db.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Mahsulotni o‘chirishda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
