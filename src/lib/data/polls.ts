import prisma from '@/lib/prisma';
import { PollSnapshot, User, Vote } from '@/types/shared';
import 'server-only';

/**
 * Fetches a poll along with all options, votes, and voters and returns the
 * result in a fully‑normalized structure
 */
export async function getPollSnapshot(pollId: string): Promise<PollSnapshot> {
  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    select: {
      id: true,
      question: true,
      allowMultipleVotes: true,
      allowVotersToAddOptions: true,
      adminToken: true,
      options: {
        select: {
          id: true,
          text: true,
          order: true,
          votes: {
            select: {
              id: true,
              optionId: true,
              userId: true,
              user: { select: { id: true, name: true } },
            },
          },
        },
        orderBy: { order: 'asc' },
      },
    },
  });

  if (!poll) {
    throw new Error('Poll not found');
  }

  const users: Record<string, User> = {};
  const votes: Record<string, Vote> = {};

  // Normalize nested votes
  for (const option of poll.options) {
    // Process votes for this option
    for (const vote of option.votes) {
      votes[vote.id] = {
        id: vote.id,
        optionId: vote.optionId,
        userId: vote.userId,
      };

      // Add voter if not already present
      if (!users[vote.user.id]) {
        users[vote.user.id] = {
          id: vote.user.id,
          name: vote.user.name ?? '',
        };
      }
    }
  }

  return {
    poll: {
      id: poll.id,
      question: poll.question,
      options: poll.options.map(option => ({
        id: option.id,
        text: option.text,
        order: option.order,
      })),
      settings: {
        allowMultipleVotes: poll.allowMultipleVotes,
        allowVotersToAddOptions: poll.allowVotersToAddOptions,
      },
      adminToken: poll.adminToken!!,
    },
    votes,
    users,
  };
}
