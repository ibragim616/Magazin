import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getSessionUser } from '@/lib/auth';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const productId = resolvedParams.id;
    const body = await request.json();
    const { rating, comment, userName } = body;

    if (!rating || !comment) {
      return NextResponse.json(
        { error: 'Baho va fikr majburiy' },
        { status: 400 }
      );
    }

    const sessionUser = await getSessionUser();

    // Determine user name
    let reviewerName = 'Mehmon';
    if (sessionUser) {
      reviewerName = sessionUser.name;
    } else if (userName && userName.trim()) {
      reviewerName = userName.trim();
    }

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Mahsulot topilmadi' },
        { status: 404 }
      );
    }

    // Create review
    const review = await db.review.create({
      data: {
        productId,
        userId: sessionUser ? sessionUser.id : null,
        userName: reviewerName,
        rating: parseInt(rating),
        comment,
      },
    });

    // Re-calculate average rating for the product
    const aggregation = await db.review.aggregate({
      where: { productId },
      _avg: { rating: true },
    });

    const averageRating = aggregation._avg.rating || rating;

    await db.product.update({
      where: { id: productId },
      data: { rating: averageRating },
    });

    return NextResponse.json({ review });
  } catch (error) {
    console.error('Review create error:', error);
    return NextResponse.json(
      { error: 'Fikr qoldirishda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
