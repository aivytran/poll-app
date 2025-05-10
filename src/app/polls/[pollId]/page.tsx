import { cookies } from 'next/headers';

import { PollContainer } from '@/components/poll/vote/PollContainer';
import { getPollData, getUserData, getUserVotes } from '@/lib/data/polls';

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

  if (!user) {
    return <div className="text-red-600">User not found</div>;
  }

  return <PollContainer user={user} poll={poll} userVotes={userVotesData.votes} token={token} />;
}
