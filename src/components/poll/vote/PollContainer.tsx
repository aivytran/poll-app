'use client';

import { useRouter } from 'next/navigation';

import { PageHeader } from '../../layout';

import { PollOption, UserVote } from '@/types/shared';
import { OptionCard } from './OptionCard';
import { QuestionCard } from './QuestionCard';
import { UserNameCard } from './UserNameCard';

interface PollContainerProps {
  initialUser: { id: string; name: string } | null;
  initialPoll: {
    id: string;
    question: string;
    allowMultipleVotes: boolean;
    allowVotersToAddOptions: boolean;
    adminToken: string;
    options: PollOption[];
  };
  initialUserVotes: UserVote[];
  token: string | null;
}

export function PollContainer({
  initialUser,
  initialPoll,
  initialUserVotes,
  token,
}: PollContainerProps) {
  const router = useRouter();

  const hasUserName = !!initialUser!.name;
  const responsesCount = initialPoll.options.reduce(
    (sum, option) => sum + (option.votes?.length || 0),
    0
  );

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={
          initialPoll.adminToken === token ? 'Vote and Manage Your Poll' : 'Vote for this Poll'
        }
        subtitle={initialPoll.adminToken === token ? 'Admin access enabled' : undefined}
      />

      {/* Username Input Section */}
      <UserNameCard
        userId={initialUser!.id}
        initialName={initialUser!.name || ''}
        onNameUpdated={() => {
          router.refresh();
        }}
      />

      {/* Poll Question Section */}
      <QuestionCard
        question={initialPoll.question}
        responsesCount={responsesCount}
        allowMultipleVotes={initialPoll.allowMultipleVotes}
      />

      {/* Options Section */}
      <OptionCard
        options={initialPoll.options}
        allowMultipleVotes={initialPoll.allowMultipleVotes}
        allowVotersToAddOptions={initialPoll.allowVotersToAddOptions}
        userId={initialUser!.id}
        userVotes={initialUserVotes}
        hasUserName={hasUserName}
        onVoteChange={() => {
          router.refresh();
        }}
        isAdmin={initialPoll.adminToken === token}
        token={token || ''}
        pollId={initialPoll.id}
      />
    </div>
  );
}
