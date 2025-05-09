'use client';

import { useRouter } from 'next/navigation';

import PageHeader from '../../layout/PageHeader';

import VoteOptions from './VoteOptions';
import VoteQuestion from './VoteQuestion';
import VoteUserName from './VoteUserName';

interface VotePollContainerProps {
  initialUser: { id: string; name: string } | null;
  initialPoll: {
    id: string;
    question: string;
    allowMultipleVotes: boolean;
    allowVotersToAddOptions: boolean;
    adminToken: string;
    options: {
      id: string;
      text: string;
      order: number;
      votes: {
        id: string;
        voterName: string;
      }[];
    }[];
  };
  initialUserVotes: {
    id: string;
    optionId: string;
  }[];
  token: string | null;
}

export default function VotePollContainer({
  initialUser,
  initialPoll,
  initialUserVotes,
  token,
}: VotePollContainerProps) {
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
      <VoteUserName
        userId={initialUser!.id}
        initialName={initialUser!.name || ''}
        onNameUpdated={() => {
          router.refresh();
        }}
      />

      {/* Poll Question Section */}
      <VoteQuestion
        question={initialPoll.question}
        responsesCount={responsesCount}
        allowMultipleVotes={initialPoll.allowMultipleVotes}
      />

      {/* Options Section */}
      <VoteOptions
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
