import { voteWithUserName } from '@/lib/extensions';
import prisma from '@/lib/prisma';
import 'server-only';

interface PollData {
  id: string;
  question: string;
  allowMultipleVotes: boolean;
  allowVotersToAddOptions: boolean;
  adminToken: string;
  createdAt: string;
  options: {
    id: string;
    text: string;
    order: number;
    votes: {
      id: string;
      voterName: string;
    }[];
  }[];
}

interface UserData {
  id: string;
  name: string;
}

interface VoteData {
  votes: {
    id: string;
    optionId: string;
  }[];
}

/**
 * Fetches poll data with options and votes
 */
export async function getPollData(pollId: string): Promise<PollData | null> {
  const extendedPrisma = prisma.$extends(voteWithUserName);

  const poll = await extendedPrisma.poll.findUnique({
    where: { id: pollId },
    select: {
      id: true,
      question: true,
      allowMultipleVotes: true,
      allowVotersToAddOptions: true,
      adminToken: true,
      createdAt: true,
      options: {
        select: {
          id: true,
          text: true,
          order: true,
          votes: {
            select: {
              id: true,
              voterName: true,
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      },
    },
  });

  if (!poll) return null;

  // Properly serialize the poll data to avoid non-serializable objects
  return {
    ...poll,
    createdAt: poll.createdAt.toISOString(),
    adminToken: poll.adminToken || '',
    options: poll.options.map(option => ({
      ...option,
      votes: option.votes.map(vote => ({
        id: vote.id,
        voterName: vote.voterName || '',
      })),
    })),
  };
}

/**
 * Fetches user votes for a specific poll
 */
export async function getUserVotes(userId: string, pollId: string): Promise<VoteData> {
  const votes = await prisma.vote.findMany({
    where: {
      userId,
      option: {
        pollId,
      },
    },
    select: {
      id: true,
      optionId: true,
    },
  });

  return {
    votes: votes.map(vote => ({
      id: vote.id,
      optionId: vote.optionId,
    })),
  };
}

/**
 * Fetches user data by ID
 */
export async function getUserData(userId: string): Promise<UserData | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true },
  });

  if (!user) return null;

  // Return a plain JavaScript object
  return {
    id: user.id,
    name: user.name || '',
  };
}
