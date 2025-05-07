import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

/**
 * Vote API Routes
 *
 * This file contains the API endpoints for vote-related operations:
 * - POST /api/votes: Create a new vote
 */

/**
 * POST /api/votes
 *
 * Creates a new vote for a specific poll option.
 * This endpoint is used when a user votes for an option in a poll.
 *
 * @param request - The incoming HTTP request containing:
 *   - optionId: The ID of the option being voted for
 *   - userId: The ID of the user casting the vote
 * @returns
 *   - 200: Created vote details
 *   - 400: Missing or invalid optionId or userId
 *   - 404: Option or user not found
 *   - 409: Duplicate vote
 *   - 500: Server error
 */
export async function POST(request: Request) {
  try {
    const { optionId, userId } = await request.json();

    if (!optionId || !userId) {
      return NextResponse.json({ error: 'optionId and userId are required' }, { status: 400 });
    }

    // Check if vote already exists for this user and option
    const existingVote = await prisma.vote.findFirst({
      where: {
        optionId,
        userId,
      },
    });

    if (existingVote) {
      // Vote already exists, return conflict status
      return NextResponse.json(
        {
          error: 'Duplicate vote',
          message: 'A vote for this option by this user already exists',
          existingVote,
        },
        { status: 409 }
      );
    }

    // Create new vote since it doesn't exist yet
    const vote = await prisma.vote.create({
      data: {
        optionId,
        userId,
      },
    });

    return NextResponse.json(vote);
  } catch (error: any) {
    console.error('Error creating vote:', error);

    if (
      (error.code === 'P2003' && // Foreign key constraint failed
        error.meta?.field_name?.includes('optionId')) ||
      error.meta?.field_name?.includes('userId')
    ) {
      return NextResponse.json({ error: 'Option or user not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to create vote' }, { status: 500 });
  }
}
