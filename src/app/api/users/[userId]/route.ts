import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

/**
 * User API Routes
 *
 * This file contains the API endpoints for user-related operations:
 * - PUT /api/users/[userId]: Update user details
 *
 * Both endpoints require a valid userId parameter in the URL.
 */

/**
 * PUT /api/users/[userId]
 *
 * Updates the details of a specific user.
 * Currently only supports updating the user's name.
 *
 * @param request - The incoming HTTP request containing the new name
 * @param params - Promise containing route parameters
 * @returns
 *   - 200: Updated user details (id, name)
 *   - 400: Missing or invalid name
 *   - 404: User not found
 *   - 500: Server error
 */
export async function PUT(request: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name },
      select: { id: true, name: true },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}
