import { ListPlus, Pencil } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import { createPollOption, deleteVote, submitVote } from '@/lib/api';

import { useAuth } from '@/hooks/AuthContext';
import { usePoll } from '@/hooks/PollContext';
import { Vote } from '@/types/shared';
import { AddOptionInput } from './AddOptionInput';
import { OptionItemCard } from './OptionItemCard';

export function OptionCardVoteMode({ onEnterEditMode }: { onEnterEditMode: () => void }) {
  const { userId } = useAuth();
  const { options, votes, users, settings, isAdmin, pollId } = usePoll();

  const [processingOptionId, setProcessingOptionId] = useState<string | null>(null);

  const { votesByOption, userVoteMap, maxVotes } = useMemo(() => {
    const votesByOption: Record<string, Vote[]> = {};
    const userVoteMap: Record<string, string> = {}; // optionId → voteId
    let max = 0;

    Object.values(votes).forEach(vote => {
      // bucket votes per option
      const bucket = votesByOption[vote.optionId] ?? (votesByOption[vote.optionId] = []);
      bucket.push(vote);

      // track the max votes per option
      if (bucket.length > max) max = bucket.length;

      // track the current user’s vote for quick lookup
      if (vote.userId === userId) {
        userVoteMap[vote.optionId] = vote.id;
      }
    });

    return { votesByOption, userVoteMap, maxVotes: max };
  }, [votes, userId]);

  // Whether to show voter names (any user has non-blank name)
  const hasUserName = useMemo(
    () => Object.values(users).some(u => (u.name ?? '').trim().length > 0),
    [users]
  );

  // Handle voting/unvoting for an option
  const handleVote = async (optionId: string) => {
    if (processingOptionId) return; // debounce double-clicks
    setProcessingOptionId(optionId);

    try {
      const existingVoteId = userVoteMap[optionId];

      if (existingVoteId) {
        /* un-vote */
        await deleteVote(existingVoteId);
      } else {
        /* cast (maybe after clearing previous vote) */
        if (!settings.allowMultipleVotes && Object.keys(userVoteMap).length > 0) {
          await deleteVote(Object.values(userVoteMap)[0]);
        }
        if (!userVoteMap[optionId]) {
          await submitVote(optionId, userId);
        }
      }
    } catch (err) {
      console.error('Error processing vote:', err);
    } finally {
      setTimeout(() => setProcessingOptionId(null), 300); // avoid rapid taps
    }
  };

  // Handle adding a new option
  const handleAddOption = async (newOption: string) => {
    try {
      const result = await createPollOption(pollId, newOption);

      if (result.error) {
        alert(result.error);
      }
    } catch (error) {
      console.error('Error adding option:', error);
    }
  };

  return (
    <>
      <CardContent className="w-full space-y-3 px-2 sm:px-4">
        {options.map(option => (
          <OptionItemCard
            key={option.id}
            id={option.id}
            text={option.text}
            votes={votesByOption[option.id]}
            isVoted={!!userVoteMap[option.id]}
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
        {settings.allowVotersToAddOptions && !isAdmin && (
          <Card className="w-full bg-primary-foreground/50 gap-2">
            <CardHeader>
              <CardTitle>
                <ListPlus className="h-5 w-5 mr-2 inline-block" />
                Add Your Own Option
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AddOptionInput onAddOption={handleAddOption} />
            </CardContent>
          </Card>
        )}
      </CardFooter>
    </>
  );
}
