import { X } from 'lucide-react';
import { forwardRef } from 'react';

import {
  Avatar,
  AvatarFallback,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui';
import { usePoll } from '@/hooks/PollContext';
import { Vote } from '@/types/shared';
import { getUserInitials } from '@/utils/pollUtils';

// Voter avatar component with forwarded ref for tooltip
export const VoterAvatar = forwardRef<HTMLDivElement, { text: string }>(
  ({ text, ...props }, ref) => {
    return (
      <Avatar
        ref={ref}
        className="h-6 w-6 cursor-pointer transition-transform hover:translate-y-[-2px]"
        {...props}
      >
        <AvatarFallback>{text}</AvatarFallback>
      </Avatar>
    );
  }
);

VoterAvatar.displayName = 'VoterAvatar';

// Group of voter avatars with tooltips
export function VoterAvatars({
  votes,
  openVoterDrawer,
}: {
  votes: Vote[];
  openVoterDrawer?: (e: React.MouseEvent) => void;
}) {
  if (!votes.length) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    if (openVoterDrawer) {
      openVoterDrawer(e);
    }
  };

  const { users } = usePoll();
  const getUserName = (vote: Vote) => {
    return users[vote.userId]?.name || 'Anonymous';
  };

  return (
    <div className="flex items-center -space-x-1 group" onClick={handleClick}>
      <TooltipProvider>
        {votes.slice(0, 3).map((vote, idx) => (
          <Tooltip key={vote.id || idx}>
            <TooltipTrigger asChild>
              <VoterAvatar text={getUserInitials(getUserName(vote))} />
            </TooltipTrigger>
            <TooltipContent>{getUserName(vote)}</TooltipContent>
          </Tooltip>
        ))}

        {votes.length > 3 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <VoterAvatar text={`+${votes.length - 3}`} />
            </TooltipTrigger>
            <TooltipContent>
              <div className="max-w-[200px]">
                <p className="font-medium mb-1">Also voted:</p>
                {votes.slice(3).map((vote, idx) => (
                  <p key={idx} className="truncate">
                    {getUserName(vote)}
                  </p>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
}

// Drawer showing all voters for an option
export function VoterDrawer({
  isOpen,
  setIsOpen,
  votes,
  optionText,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  votes: Vote[];
  optionText: string;
}) {
  const { users } = usePoll();
  const getUserName = (vote: Vote) => {
    return users[vote.userId]?.name || 'Anonymous';
  };
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent>
        <DrawerHeader className="text-left py-2">
          <div className="flex items-center justify-between">
            <DrawerTitle>Voters for "{optionText}"</DrawerTitle>
            <DrawerClose asChild>
              <X className="w-5 h-5 text-primary" />
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="p-4 space-y-2">
          {votes.length > 0 ? (
            votes.map(vote => (
              <div key={vote.id} className="flex items-center space-x-3 px-2 pb-2">
                <VoterAvatar text={getUserInitials(getUserName(vote))} />
                <span className="font-medium">{getUserName(vote)}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">No votes yet</div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
