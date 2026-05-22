import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const revalidate = 0;

export async function GET() {
  try {
    const categories = await db.category.findMany({
      where: { parentId: null },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Fetch categories error:', error);
    return NextResponse.json(
      { error: 'Kategoriyalarni yuklashda xatolik yuz berdi' },
      { status: 500 }
    );
  }
}
