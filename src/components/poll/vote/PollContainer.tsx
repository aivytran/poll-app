'use client';

import { PageHeader } from '@/components/layout/PageHeader';
import { usePoll } from '@/hooks/PollContext';
import { OptionCard } from './OptionCard';
import { QuestionCard } from './QuestionCard';
import { UserNameCard } from './UserNameCard';

export function PollContainer() {
  const { isAdmin } = usePoll();

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
