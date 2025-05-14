import { useCallback, useState } from 'react';

import { Badge, Card, CardContent, Progress } from '@/components/ui';
import { cn } from '@/lib/utils';

import { PollOption, Vote } from '@/types/shared';
import { VoterAvatars, VoterDrawer } from './VoterComponents';

interface OptionItemCardProps {
  option: PollOption;
  votes?: Vote[];
  isVoted: boolean;
  progressBarPercentage: number;
  onClick: (id: string, e?: React.MouseEvent) => void;
  isDisabled?: boolean;
}

export function OptionItemCard({
  option,
  votes = [],
  isVoted,
  progressBarPercentage,
  onClick,
  isDisabled = false,
}: OptionItemCardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openVoterDrawer = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setDrawerOpen(true);
  }, []);

  const cardClasses = cn(
    'w-full border-0 shadow-none bg-transparent py-0 group',
    !isDisabled
      ? 'hover:bg-accent/10 transition-colors cursor-pointer'
      : 'opacity-80 pointer-events-none'
  );

  return (
    <>
      <Card
        role="button"
        className={cardClasses}
        onClick={() => onClick(option.id)}
        aria-disabled={isDisabled}
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
              <span className={cn('font-medium truncate')}>{option.text}</span>
            </div>

            {/* Vote count and avatars */}
            <div
              className={cn('flex items-center flex-shrink-0 ml-2')}
              onClick={e => {
                e.stopPropagation();
                openVoterDrawer(e);
              }}
            >
              <VoterAvatars votes={votes} openVoterDrawer={openVoterDrawer} />

              <Badge className="border-none" variant="outline">
                {votes.length}
              </Badge>
            </div>
          </div>

          {/* Progress bar */}
          <Progress value={progressBarPercentage} />
        </CardContent>
      </Card>

      <VoterDrawer
        isOpen={drawerOpen}
        setIsOpen={setDrawerOpen}
        votes={votes}
        optionText={option.text}
      />
    </>
  );
}
