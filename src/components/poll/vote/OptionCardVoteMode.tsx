'use client';

import { ListPlus, Pencil } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import { useAuth } from '@/hooks/AuthContext';
import { usePoll } from '@/hooks/PollContext';
import { createPollOption, deleteVote, submitVote } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Vote } from '@/types/shared';

import { calculateProgressPercentage } from '@/utils/pollUtils';
import { AddOptionInput } from './AddOptionInput';
import { OptionItemCard } from './OptionItemCard';

export function OptionCardVoteMode({ onEnterEditMode }: { onEnterEditMode: () => void }) {
  const { userId } = useAuth();
  const { options, votes, users, settings, isAdmin, pollId, setVotes } = usePoll();
  const [processingOptionId, setProcessingOptionId] = useState<string | null>(null);

  const { votesByOption, userVoteMap, maxVotes } = useMemo(() => {
    const result: {
      votesByOption: Record<string, Vote[]>;
      userVoteMap: Record<string, string>;
      maxVotes: number;
    } = { votesByOption: {}, userVoteMap: {}, maxVotes: 0 };

    Object.values(votes).forEach(vote => {
      const bucket =
        result.votesByOption[vote.optionId] ?? (result.votesByOption[vote.optionId] = []);
      bucket.push(vote);

      if (bucket.length > result.maxVotes) result.maxVotes = bucket.length;

      if (vote.userId === userId) {
        result.userVoteMap[vote.optionId] = vote.id;
      }
    });

    return result;
  }, [votes, userId]);

  const handleVote = useCallback(
    async (optionId: string) => {
      if (processingOptionId) return; // debounce rapid taps
      setProcessingOptionId(optionId);

      try {
        const existingVoteId = userVoteMap[optionId];

        if (existingVoteId) {
          await deleteVote(existingVoteId);
          const { [existingVoteId]: _removed, ...rest } = votes;
          setVotes(rest);
          return;
        }

        // If only one vote is allowed, clear the user’s previous vote first
        if (!settings.allowMultipleVotes) {
          const prevVoteIds = Object.values(userVoteMap);
          if (prevVoteIds.length) {
            const prevId = prevVoteIds[0];
            await deleteVote(prevId);
            const { [prevId]: _r, ...rest } = votes;
            setVotes(rest);
          }
        }

        const newVote = await submitVote(optionId, userId);
        if (newVote) {
          setVotes({ ...votes, [newVote.id]: newVote });
        }
      } catch (err) {
        console.error('Error processing vote:', err);
      } finally {
        setProcessingOptionId(null);
      }
    },
    [processingOptionId, userVoteMap, settings.allowMultipleVotes, userId, setVotes, votes]
  );

  const handleAddOption = useCallback(
    async (newOptionText: string) => {
      try {
        const { error } = await createPollOption(pollId, newOptionText);
        if (error) alert(error);
      } catch (err) {
        console.error('Error adding option:', err);
      }
    },
    [pollId]
  );

  const currentUserNamePresent = (users[userId]?.name ?? '').trim().length > 0;

  return (
    <div
      className={cn(
        !currentUserNamePresent && 'pointer-events-none opacity-60 select-none cursor-not-allowed'
      )}
    >
      <CardContent className="w-full space-y-3 px-2 sm:px-4">
        {options.map(option => (
          <OptionItemCard
            key={option.id}
            option={option}
            votes={votesByOption[option.id]}
            onClick={handleVote}
            isVoted={!!userVoteMap[option.id]}
            isDisabled={processingOptionId === option.id}
            progressBarPercentage={calculateProgressPercentage(
              votesByOption[option.id]?.length,
              maxVotes
            )}
          />
        ))}
      </CardContent>

      <CardFooter>
        {isAdmin && (
          <Button onClick={onEnterEditMode} className="w-full mt-8">
            <Pencil className="h-4 w-4 mr-2" />
            Edit Poll Options
          </Button>
        )}

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
    </div>
  );
}
