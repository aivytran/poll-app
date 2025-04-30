'use client';
import { Card } from '@/components/ui';
import { useState } from 'react';
import VoteOptionEditMode from './VoteOptionEditMode';
import VoteOptionVoteMode from './VoteOptionVoteMode';
import VoteStatusMessage from './VoteStatusMessage';

// Proper type definition with all fields
export interface PollOption {
  id: string;
  text: string;
  votes?: { id: string; userId?: string; voterName?: string }[];
  order?: number;
  isNew?: boolean;
}

// Props interface for better type safety
interface VoteOptionsProps {
  options: PollOption[];
  allowMultipleVotes: boolean;
  allowVotersToAddOptions: boolean;
  userId: string;
  userVotes: {
    id: string;
    optionId: string;
  }[];
  hasUserName: boolean;
  onVoteChange: () => void;
  isAdmin?: boolean;
  token?: string;
  pollId?: string;
}

export default function VoteOptions({
  options,
  allowMultipleVotes,
  allowVotersToAddOptions,
  userId,
  userVotes,
  hasUserName,
  onVoteChange,
  isAdmin = false,
  token = '',
  pollId = '',
}: VoteOptionsProps) {
  // UI state
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div className="w-full" data-poll-id={pollId}>
      <Card className="w-full">
        <VoteStatusMessage
          hasUserName={hasUserName}
          isEditMode={isEditMode}
          hasVoted={Object.keys(userVotes).length > 0}
          allowMultipleVotes={allowMultipleVotes}
        />

        {isEditMode ? (
          <VoteOptionEditMode
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
          <VoteOptionVoteMode
            userId={userId}
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
