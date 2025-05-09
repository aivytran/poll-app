import { ListPlus, Pencil } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import { createPollOption, deleteVote, submitVote } from '@/lib/api';

import VoteAddOption from './VoteAddOption';
import VoteOptionItem from './VoteOptionItem';
import { PollOption } from './VoteOptions';

interface VoteOptionVoteModeProps {
  userId: string;
  pollId: string;
  options: PollOption[];
  userVotes: {
    id: string;
    optionId: string;
  }[];
  allowVotersToAddOptions: boolean;
  allowMultipleVotes: boolean;
  hasUserName: boolean;
  isAdmin: boolean;
  onVoteChange: () => void;
  onEnterEditMode: () => void;
}

export default function VoteOptionVoteMode({
  userId,
  pollId,
  options,
  userVotes,
  allowVotersToAddOptions,
  allowMultipleVotes,
  hasUserName,
  isAdmin,
  onVoteChange,
  onEnterEditMode,
}: VoteOptionVoteModeProps) {
  const [newOption, setNewOption] = useState('');
  const [processingOptionId, setProcessingOptionId] = useState<string | null>(null);
  const maxVotes = useMemo(
    () => options.reduce((max, option) => Math.max(max, option.votes?.length || 0), 0),
    [options]
  );
  const optionToUserVoteMap = useMemo(
    () => Object.fromEntries(userVotes.map(vote => [vote.optionId, vote.id])),
    [userVotes]
  );
  const userVotedOptions = useMemo(() => Object.keys(optionToUserVoteMap), [optionToUserVoteMap]);

  // Handle voting/unvoting for an option
  const handleVote = async (optionId: string) => {
    // Prevent multiple rapid clicks on the same option
    if (processingOptionId) {
      return;
    }

    setProcessingOptionId(optionId);

    try {
      const voteId = optionToUserVoteMap[optionId];

      if (voteId) {
        // User already voted for this option - remove the vote
        await deleteVote(voteId);
      } else {
        // Add new vote (possibly removing existing vote first)
        if (!allowMultipleVotes && userVotedOptions.length > 0) {
          // Single vote mode: remove existing vote first
          const existingVoteId = optionToUserVoteMap[userVotedOptions[0]];
          if (existingVoteId) {
            await deleteVote(existingVoteId);
          }
        }

        // This prevents duplicate votes in case of race conditions
        const doubleCheckVoteId = optionToUserVoteMap[optionId];
        if (!doubleCheckVoteId) {
          // Submit the new vote
          await submitVote(optionId, userId);
        } else {
          console.log('Prevented duplicate vote submission');
        }
      }

      onVoteChange();
    } catch (error) {
      console.error('Error processing vote:', error);
    } finally {
      // Wait a short delay before allowing new votes
      // This prevents rapid clicks even after state update
      setTimeout(() => {
        setProcessingOptionId(null);
      }, 300);
    }
  };

  // Handle adding a new option
  const handleAddOption = async () => {
    try {
      const result = await createPollOption(pollId, newOption);

      if (result.error) {
        alert(result.error);
      } else {
        setNewOption('');
        onVoteChange();
      }
    } catch (error) {
      console.error('Error adding option:', error);
    }
  };

  return (
    <>
      <CardContent className="w-full space-y-3 px-2 sm:px-4">
        {options.map(option => (
          <VoteOptionItem
            key={option.id}
            id={option.id}
            text={option.text}
            votes={option.votes}
            isVoted={!!optionToUserVoteMap[option.id]}
            maxVotes={maxVotes}
            hasUserName={hasUserName}
            onClick={id => handleVote(id)}
            isProcessing={processingOptionId === option.id}
          />
        ))}
      </CardContent>
      <CardFooter>
        {/* Admin Edit Button */}
        {isAdmin && (
          <Button onClick={onEnterEditMode} className="w-full">
            <Pencil className="h-4 w-4 mr-2" />
            Edit Poll Options
          </Button>
        )}

        {/* Add Option Card - Only show for non-admin users when allowing voter options */}
        {allowVotersToAddOptions && hasUserName && !isAdmin && (
          <Card className="w-full bg-primary-foreground/50 gap-2">
            <CardHeader>
              <CardTitle>
                <ListPlus className="h-5 w-5 mr-2 inline-block" />
                Add Your Own Option
              </CardTitle>
            </CardHeader>
            <CardContent>
              <VoteAddOption
                value={newOption}
                onValueChange={setNewOption}
                onAddOption={handleAddOption}
              />
            </CardContent>
          </Card>
        )}
      </CardFooter>
    </>
  );
}
