import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * POST /api/users/create
 *
 * Creates a new guest user account.
 * Used by middleware to generate IDs for new visitors.
 */
export async function POST() {
  try {
    const guestUser = await prisma.user.create({
      data: {
        isAuthenticated: false,
      },
    });

    return NextResponse.json({ id: guestUser.id });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
