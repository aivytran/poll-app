'use client';

import { useEffect } from 'react';

import { PageHeader } from '@/components/layout/PageHeader';
import { usePoll } from '@/hooks/PollContext';
import { PollData, User, Vote } from '@/types/shared';
import { OptionCard } from './OptionCard';
import { QuestionCard } from './QuestionCard';
import { UserNameCard } from './UserNameCard';

export function PollContainer({
  poll,
  votes,
  users,
  isAdmin,
}: {
  poll: PollData;
  votes: Record<string, Vote>;
  users: Record<string, User>;
  isAdmin: boolean;
}) {
  const { setPollId, setQuestion, setOptions, setSettings, setIsAdmin, setVotes, setUsers } =
    usePoll();

  useEffect(() => {
    setPollId(poll.id);
    setQuestion(poll.question);
    setOptions(poll.options);
    setSettings({
      allowMultipleVotes: poll.pollSettings.allowMultipleVotes,
      allowVotersToAddOptions: poll.pollSettings.allowVotersToAddOptions,
    });
    setIsAdmin(isAdmin);
    setVotes(votes);
    setUsers(users);
  }, [
    poll,
    votes,
    users,
    isAdmin,
    setPollId,
    setQuestion,
    setOptions,
    setSettings,
    setIsAdmin,
    setVotes,
    setUsers,
  ]);

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={isAdmin ? 'Vote and Manage Your Poll' : 'Vote for this Poll'}
        subtitle={isAdmin ? 'Admin access enabled' : undefined}
      />

      <UserNameCard />

      <QuestionCard />

      <OptionCard />
    </div>
  );
}
