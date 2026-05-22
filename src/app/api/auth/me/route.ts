import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Fetch session error:', error);
    return NextResponse.json(
      { error: 'Tizim xatoligi yuz berdi' },
      { status: 500 }
    );
  }
}
