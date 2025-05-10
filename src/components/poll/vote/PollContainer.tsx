'use client';

import { useRouter } from 'next/navigation';

import { PageHeader } from '../../layout';

import { PollOption, User, UserVote } from '@/types/shared';
import { OptionCard } from './OptionCard';
import { QuestionCard } from './QuestionCard';
import { UserNameCard } from './UserNameCard';

interface PollContainerProps {
  user: User;
  poll: {
    id: string;
    question: string;
    allowMultipleVotes: boolean;
    allowVotersToAddOptions: boolean;
    adminToken: string;
    options: PollOption[];
  };
  userVotes: UserVote[];
  token: string | null;
}

export function PollContainer({ user, poll, userVotes, token }: PollContainerProps) {
  const router = useRouter();

  const hasUserName = !!user!.name;
  const responsesCount = poll.options.reduce((sum, option) => sum + (option.votes?.length || 0), 0);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={poll.adminToken === token ? 'Vote and Manage Your Poll' : 'Vote for this Poll'}
        subtitle={poll.adminToken === token ? 'Admin access enabled' : undefined}
      />

      {/* Username Input Section */}
      <UserNameCard
        user={user}
        onNameUpdated={() => {
          router.refresh();
        }}
      />

      {/* Poll Question Section */}
      <QuestionCard
        question={poll.question}
        responsesCount={responsesCount}
        allowMultipleVotes={poll.allowMultipleVotes}
      />

      {/* Options Section */}
      <OptionCard
        options={poll.options}
        allowMultipleVotes={poll.allowMultipleVotes}
        allowVotersToAddOptions={poll.allowVotersToAddOptions}
        userVotes={userVotes}
        hasUserName={hasUserName}
        onVoteChange={() => {
          router.refresh();
        }}
        isAdmin={poll.adminToken === token}
        token={token || ''}
        pollId={poll.id}
      />
    </div>
  );
}
