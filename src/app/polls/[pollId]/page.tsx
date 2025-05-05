import { cookies } from 'next/headers';

import VotePollContainer from '@/components/poll/vote/VotePollContainer';
import { voteWithUserName } from '@/lib/extensions';
import prisma from '@/lib/prisma';

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
async function getPollData(pollId: string): Promise<PollData | null> {
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
async function getUserVotes(userId: string, pollId: string): Promise<VoteData> {
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
async function getUserData(userId: string): Promise<UserData | null> {
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

export default async function PollPage({
  params,
  searchParams,
}: {
  params: Promise<{ pollId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { pollId } = await params;
  const resolvedSearchParams = await searchParams;
  const token = (resolvedSearchParams.token as string) || null;

  // Get user ID from cookies
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')!.value;

  // Fetch all data in parallel
  const [poll, userVotesData, user] = await Promise.all([
    getPollData(pollId),
    getUserVotes(userId, pollId),
    getUserData(userId),
  ]);

  if (!poll) {
    return <div className="text-red-600">Poll not found</div>;
  }

  return (
    <VotePollContainer
      initialUser={user}
      initialPoll={poll}
      initialUserVotes={userVotesData.votes}
      token={token}
    />
  );
}
