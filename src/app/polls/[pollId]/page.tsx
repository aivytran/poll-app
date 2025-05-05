import { cookies } from 'next/headers';

import VotePollContainer from '@/components/poll/vote/VotePollContainer';
import { fetchPoll, fetchUser, fetchVotesByUserId } from '@/lib/api';
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

export default async function PollPage({
  params,
  searchParams,
}: {
  params: { pollId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [{ pollId }, resolvedSearchParams] = await Promise.all([params, searchParams]);
  const token = (resolvedSearchParams.token as string) || null;

  // Get user ID from cookies - using await with cookies()
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')!.value;

  // Fetch all data on the server
  const [poll, userVotes, user] = await Promise.all([
    fetchPoll(pollId) as Promise<PollData>,
    fetchVotesByUserId(userId, pollId) as Promise<VoteData>,
    fetchUser(userId) as Promise<UserData>,
  ]);

  if (!poll) {
    return <div className="text-red-600">Poll not found</div>;
  }

  // Create a map of optionId to voteId for easy lookup
  const optionToVoteMap: Record<string, string> = {};
  if (userVotes.votes) {
    userVotes.votes.forEach(vote => {
      optionToVoteMap[vote.optionId] = vote.id;
    });
  }

  return (
    <VotePollContainer
      initialUser={user}
      initialPoll={poll}
      initialUserVotes={userVotes.votes}
      token={token}
    />
  );
}
