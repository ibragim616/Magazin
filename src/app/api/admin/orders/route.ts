import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export const revalidate = 0;

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Ruxsat etilmagan' }, { status: 403 });
    }

    const orders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Admin fetch orders error:', error);
    return NextResponse.json(
      { error: 'Buyurtmalarni yuklashda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
