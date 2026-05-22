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
    const orderId = resolvedParams.id;
    const body = await request.json();
    const { status, paymentStatus } = body;

    // Check if order exists
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: 'Buyurtma topilmadi' }, { status: 404 });
    }

    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        status: status !== undefined ? status : order.status,
        paymentStatus: paymentStatus !== undefined ? paymentStatus : order.paymentStatus,
      },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error('Admin update order error:', error);
    return NextResponse.json(
      { error: 'Buyurtmani yangilashda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
