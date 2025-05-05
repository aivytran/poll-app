import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET() {
  const cookieStore = await cookies();
  const existingUserId = cookieStore.get('user_id')?.value;

  if (existingUserId) {
    // If user_id already exists in cookie, return it
    return NextResponse.json({ userId: existingUserId });
  }

  // Otherwise create a new guest user
  const guest = await prisma.user.create({
    data: {
      isAuthenticated: false,
    },
  });

  return NextResponse.json({ userId: guest.id });
}
