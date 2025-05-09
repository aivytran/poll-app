import crypto from 'crypto';

import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

/**
 * Poll API Routes
 *
 * This file contains the API endpoints for poll-related operations:
 * - POST /api/polls: Create a new poll with options
 *
 * The endpoint handles creation of polls and generates secure admin tokens.
 */

/**
 * POST /api/polls
 *
 * Creates a new poll with options in a single database operation.
 * Generates a secure random admin token for poll management.
 *
 * @param req - The incoming HTTP request with poll details in the body
 * @returns
 *   - 200: Created poll with voting and admin links
 *   - 400: Missing required fields
 *   - 500: Server error
 */
export async function POST(req: Request) {
  const {
    question,
    userId,
    allowMultipleVotes,
    options,
    allowVotersToAddOptions = false,
  } = await req.json();

  if (!question || !userId || !options || !Array.isArray(options)) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const adminToken = crypto.randomBytes(12).toString('hex');

  try {
    const poll = await prisma.poll.create({
      data: {
        question,
        userId,
        allowMultipleVotes,
        allowVotersToAddOptions,
        adminToken,
        options: { create: options.map((text: string, index: number) => ({ text, order: index })) },
      },
      include: { options: true },
    });

    return NextResponse.json({
      poll,
      links: {
        voteLink: `${process.env.NEXT_PUBLIC_BASE_URL}/polls/${poll.id}`,
        adminLink: `${process.env.NEXT_PUBLIC_BASE_URL}/polls/${poll.id}?token=${adminToken}`,
      },
    });
  } catch (error) {
    console.error('Error creating poll:', error);
    return NextResponse.json({ error: 'Failed to create poll' }, { status: 500 });
  }
}
