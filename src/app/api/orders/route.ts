/* eslint-disable @typescript-eslint/no-explicit-any */
 
 
 
import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerName, customerPhone, customerAddress, items, paymentMethod } = body;

    if (!customerName || !customerPhone || !customerAddress || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Barcha majburiy ma‘lumotlarni kiriting' },
        { status: 400 }
      );
    }

    const sessionUser = await getSessionUser();

    // Verify products, update stock and calculate total in transaction
    const order = await db.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Mahsulot topilmadi`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`"${product.name}" mahsulotidan omborda yetarli emas. Bor-yo‘g‘i ${product.stock} ta qolgan.`);
        }

        const activePrice = product.discountPrice !== null ? product.discountPrice : product.price;
        totalAmount += activePrice * item.quantity;

        // Prepare order item data
        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          price: activePrice,
        });

        // Decrease stock
        await tx.product.update({
          where: { id: product.id },
          data: {
            stock: product.stock - item.quantity,
          },
        });
      }

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          userId: sessionUser ? sessionUser.id : null,
          customerName,
          customerPhone,
          customerAddress,
          totalAmount,
          paymentMethod: paymentMethod || 'CASH',
          paymentStatus: 'PENDING',
          status: 'PENDING',
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      return newOrder;
    });

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error('Order placement error:', error);
    return NextResponse.json(
      { error: error.message || 'Buyurtma berishda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
