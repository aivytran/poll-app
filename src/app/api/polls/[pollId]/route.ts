import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';

/**
 * Poll API Routes
 *
 * This file contains the API endpoints for poll-related operations:
 * - PATCH /api/polls/[pollId]: Update multiple aspects of a poll at once
 *
 * The endpoint requires a valid pollId parameter in the URL.
 */

/**
 * PATCH /api/polls/[pollId]
 *
 * Updates poll options by creating new options, updating existing ones,
 * and removing deleted options in a single transaction.
 * Preserves the option order specified in the request.
 *
 * @param request - The incoming HTTP request with options array and admin token
 * @param params - Promise containing route parameters
 * @returns
 *   - 200: Successfully updated poll options
 *   - 400: Missing options
 *   - 401: Invalid admin token
 *   - 500: Server error
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ pollId: string }> }
) {
  const { pollId } = await params;

  try {
    const { options, token } = await request.json();

    if (!options?.length) {
      return NextResponse.json({ error: 'Missing options' }, { status: 400 });
    }

    // Verify token
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      select: { adminToken: true },
    });

    if (!poll || poll.adminToken !== token) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get existing option IDs for cleanup
    const existingOptions = await prisma.pollOption.findMany({
      where: { pollId },
      select: { id: true },
    });

    const existingOptionIds = new Set(existingOptions.map(opt => opt.id));
    const optionIdsToKeep = new Set(
      options
        .filter((opt: { id?: string }) => opt.id && existingOptionIds.has(opt.id))
        .map((opt: { id: string }) => opt.id)
    );

    await prisma.$transaction(async tx => {
      // Delete options that aren't in the update
      if (existingOptionIds.size > optionIdsToKeep.size) {
        await tx.pollOption.deleteMany({
          where: {
            pollId,
            id: { notIn: Array.from(optionIdsToKeep) as string[] },
          },
        });
      }

      // Upsert all options in a single batch operation
      await Promise.all(
        options.map(async (opt: { id?: string; text: string; order: number }, index: number) => {
          const order = opt.order ?? index;

          if (opt.id && existingOptionIds.has(opt.id)) {
            // Update existing option
            return tx.pollOption.update({
              where: { id: opt.id },
              data: { text: opt.text, order },
            });
          } else if (opt.text?.trim()) {
            // Create new option
            return tx.pollOption.create({
              data: {
                pollId,
                text: opt.text,
                order,
              },
            });
          }
          return null;
        })
      );
    });

    return NextResponse.json({ message: 'Poll options updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating poll:', error);
    return NextResponse.json({ error: 'Failed to update poll' }, { status: 500 });
  }
}
