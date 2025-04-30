import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * Vote API Routes
 *
 * This file contains the API endpoints for vote-related operations:
 * - GET /api/votes: Fetch votes by user ID with optional filters
 * - POST /api/votes: Create a new vote
 */

/**
 * GET /api/votes
 *
 * Fetches votes by user ID with optional filtering by poll ID.
 * This endpoint is used to get a user's votes for all polls or a specific poll.
 *
 * Query Parameters:
 * - userId: Filter votes by user ID
 * - pollId: Filter votes by poll ID
 *
 * @param request - The incoming HTTP request
 * @returns
 *   - 200: List of votes matching the filters
 *   - 400: Missing  userId
 *   - 500: Server error
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const pollId = searchParams.get('pollId');

  if (!userId) {
    return NextResponse.json({ error: 'userId is required' }, { status: 400 });
  }

  try {
    // Fetch votes for the given user, optionally filtering by pollId
    // via nested option relation
    const votes = await prisma.vote.findMany({
      where: {
        userId,
        ...(pollId && {
          option: {
            pollId,
          },
        }),
      },
      select: {
        id: true,
        optionId: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ votes });
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json({ error: 'Failed to fetch votes' }, { status: 500 });
  }
}

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
 *   - 500: Server error
 */
export async function POST(request: Request) {
  try {
    const { optionId, userId } = await request.json();

    if (!optionId || !userId) {
      return NextResponse.json({ error: 'optionId and userId are required' }, { status: 400 });
    }

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
