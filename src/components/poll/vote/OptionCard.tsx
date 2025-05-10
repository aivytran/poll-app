'use client';
import { useState } from 'react';

import { Card } from '@/components/ui';
import { PollOption, UserVote } from '@/types/shared';
import { OptionCardEditMode } from './OptionCardEditMode';
import { OptionCardStatusMessage } from './OptionCardStatusMessage';
import { OptionCardVoteMode } from './OptionCardVoteMode';

interface OptionCardProps {
  options: PollOption[];
  allowMultipleVotes: boolean;
  allowVotersToAddOptions: boolean;
  userVotes: UserVote[];
  hasUserName: boolean;
  onVoteChange: () => void;
  isAdmin?: boolean;
  token?: string;
  pollId?: string;
}

export function OptionCard({
  options,
  allowMultipleVotes,
  allowVotersToAddOptions,
  userVotes,
  hasUserName,
  onVoteChange,
  isAdmin = false,
  token = '',
  pollId = '',
}: OptionCardProps) {
  // UI state
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div className="w-full" data-poll-id={pollId}>
      <Card className="w-full">
        <OptionCardStatusMessage
          hasUserName={hasUserName}
          isEditMode={isEditMode}
          hasVoted={Object.keys(userVotes).length > 0}
          allowMultipleVotes={allowMultipleVotes}
        />

        {isEditMode ? (
          <OptionCardEditMode
            pollId={pollId}
            token={token}
            initialOptions={options}
            onSaveComplete={() => {
              setIsEditMode(false);
              onVoteChange();
            }}
            onCancelEdit={() => setIsEditMode(false)}
          />
        ) : (
          <OptionCardVoteMode
            pollId={pollId}
            options={options}
            userVotes={userVotes}
            allowVotersToAddOptions={allowVotersToAddOptions}
            allowMultipleVotes={allowMultipleVotes}
            hasUserName={hasUserName}
            isAdmin={isAdmin}
            onVoteChange={onVoteChange}
            onEnterEditMode={() => setIsEditMode(true)}
          />
        )}
      </Card>
    </div>
  );
}
