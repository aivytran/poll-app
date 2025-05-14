import { PollContainer } from '@/components/poll/vote/PollContainer';
import { PollContextProvider } from '@/hooks/PollContext';
import { getPollSnapshot } from '@/lib/data/polls';

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

  const { poll, votes, users } = await getPollSnapshot(pollId);
  const isAdmin = poll.adminToken === token;
  return (
    <PollContextProvider
      initialPoll={poll}
      initialVotes={votes}
      initialUsers={users}
      initialIsAdmin={isAdmin}
    >
      <PollContainer />
    </PollContextProvider>
  );
}
