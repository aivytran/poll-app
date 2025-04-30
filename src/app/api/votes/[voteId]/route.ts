import { Prisma, PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

/**
 * Vote API Routes
 *
 * This file contains the API endpoints for vote-related operations:
 * - DELETE /api/votes/[voteId]: Delete a vote (unvote)
 *
 * The endpoint requires a valid voteId parameter in the URL.
 */

/**
 * DELETE /api/votes/[voteId]
 *
 * Deletes a vote, effectively unvoting the user from an option.
 * This endpoint is used when a user clicks an option they've already voted for.
 *
 * @param request - The incoming HTTP request
 * @param params - Route parameters containing the voteId
 * @returns
 *   - 200: Successfully deleted vote
 *   - 404: Vote not found
 *   - 500: Server error
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ voteId: string }> }
) {
  const { voteId } = await params;

  try {
    const prisma = new PrismaClient();

    // Delete the vote
    await prisma.vote.delete({
      where: { id: voteId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting vote:', error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return NextResponse.json(
          {
            error: 'Vote not found',
            message: `No vote found with ID: ${voteId}`,
            code: 'VOTE_NOT_FOUND',
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          error: 'Database error',
          message: error.message,
          code: error.code,
          meta: error.meta,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred while deleting the vote',
        code: 'INTERNAL_SERVER_ERROR',
      },
      { status: 500 }
    );
  }
}
