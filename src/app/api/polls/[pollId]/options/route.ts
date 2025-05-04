import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * Poll options API Routes
 *
 * This file contains RESTful API endpoints for poll options:
 * - POST /api/polls/[pollId]/options: Create a new option for a poll
 */

/**
 * POST /api/polls/[pollId]/options
 *
 * Creates a new option for a poll.
 * Requires the admin token for authentication unless allowVoterOptions is enabled.
 *
 * @param request - The incoming HTTP request with optionText and token in the body
 * @param context - Context object containing route parameters
 * @returns
 *   - 201: Created option
 *   - 400: Missing required fields
 *   - 401: Invalid token or voter options not allowed
 *   - 404: Poll not found
 *   - 500: Server error
 */
export async function POST(request: Request, context: { params: { pollId: string } }) {
  const { pollId } = context.params;

  try {
    const { text, token } = await request.json();

    // Validate request body
    if (!text) {
      return NextResponse.json(
        { error: 'Missing required fields', details: 'Option text is required' },
        { status: 400 }
      );
    }

    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
    });

    if (!poll) {
      return NextResponse.json({ error: 'Poll not found' }, { status: 404 });
    }

    // For voter requests, check if voter-added options are allowed
    const isAdminRequest = token && poll.adminToken === token;
    if (!isAdminRequest && !poll.allowVotersToAddOptions) {
      return NextResponse.json(
        { error: 'Voter-added options are not enabled for this poll' },
        { status: 401 }
      );
    }

    // Get the maximum order value from existing options
    const maxOrderOption = await prisma.pollOption.findFirst({
      where: { pollId },
      orderBy: { order: 'desc' },
    });

    const nextOrder = maxOrderOption ? maxOrderOption.order + 1 : 0;

    // Create the new option
    const newOption = await prisma.pollOption.create({
      data: {
        pollId,
        text,
        order: nextOrder,
      },
    });

    return NextResponse.json(newOption, { status: 201 });
  } catch (error) {
    console.error('Error creating poll option:', error);
    return NextResponse.json({ error: 'Failed to create poll option' }, { status: 500 });
  }
}
