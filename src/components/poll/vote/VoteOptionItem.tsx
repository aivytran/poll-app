import { Badge, Card, CardContent, Progress } from '@/components/ui';
import { cn } from '@/lib/utils';
import { calculateProgressPercentage } from '@/utils/pollUtils';
import { useCallback, useMemo, useState } from 'react';
import { VoterAvatars, VoterDrawer, type VoteInfo } from './VoterComponents';

interface VoteOptionItemProps {
  id: string;
  text: string;
  votes?: VoteInfo[];
  isVoted: boolean;
  maxVotes: number;
  hasUserName: boolean;
  onClick: (id: string, e: React.MouseEvent) => void;
}

export default function VoteOptionItem({
  id,
  text,
  votes = [],
  isVoted,
  maxVotes,
  hasUserName,
  onClick,
}: VoteOptionItemProps) {
  const voteCount = useMemo(() => votes.length, [votes]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const progressPercentage = useMemo(
    () => calculateProgressPercentage(voteCount, maxVotes),
    [voteCount, maxVotes]
  );

  const openVoterDrawer = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDrawerOpen(true);
  }, []);

  const handleCardClick = useCallback(
    (e: React.MouseEvent) => {
      if (!hasUserName) return;
      onClick(id, e);
    },
    [hasUserName, onClick, id]
  );

  const cardClasses = cn(
    'w-full border-0 shadow-none bg-transparent py-0 group',
    hasUserName
      ? 'hover:bg-accent/10 transition-colors cursor-pointer'
      : 'opacity-80 pointer-events-none'
  );

  return (
    <>
      <Card
        role="button"
        tabIndex={hasUserName ? 0 : -1}
        className={cardClasses}
        onClick={handleCardClick}
        aria-disabled={!hasUserName}
        aria-pressed={isVoted}
      >
        <CardContent className="p-1 pb-0">
          <div className="w-full py-2.5 px-2 text-foreground flex items-center justify-between relative">
            {/* Option indicator and text */}
            <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
              <div
                className={cn(
                  'relative h-4 w-4 flex-shrink-0 rounded-full border transition-colors',
                  isVoted ? 'border-primary border-2' : 'border-muted-foreground/50'
                )}
              >
                {isVoted && <div className="absolute inset-0.5 rounded-full bg-primary" />}
              </div>
              <span className="font-medium truncate">{text}</span>
            </div>

            {/* Vote count and avatars */}
            <div
              className="flex items-center flex-shrink-0 ml-2"
              onClick={e => {
                e.stopPropagation();
                openVoterDrawer(e);
              }}
            >
              <VoterAvatars votes={votes} openVoterDrawer={openVoterDrawer} />

              <Badge className="border-none" variant="outline">
                {voteCount}
              </Badge>
            </div>
          </div>

          {/* Progress bar */}
          <Progress value={progressPercentage} />
        </CardContent>
      </Card>

      <VoterDrawer isOpen={drawerOpen} setIsOpen={setDrawerOpen} votes={votes} optionText={text} />
    </>
  );
}
