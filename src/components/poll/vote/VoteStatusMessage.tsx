import { CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { CheckCircle, Edit, Info, MousePointer } from 'lucide-react';

interface VoteStatusMessageProps {
  hasUserName: boolean;
  isEditMode: boolean;
  hasVoted: boolean;
  allowMultipleVotes: boolean;
}

export default function VoteStatusMessage({
  hasUserName,
  isEditMode,
  hasVoted,
  allowMultipleVotes,
}: VoteStatusMessageProps) {
  const getStatusMessage = () => {
    if (!hasUserName) {
      return {
        line1: 'Enter your name to vote',
        line2: 'Your name appears with your vote',
      };
    } else if (isEditMode) {
      return {
        line1: 'Edit Poll Options',
        line2: 'Reorder, edit, or remove options',
        line3: '* Options with votes can only be reordered',
      };
    } else if (hasVoted) {
      return {
        line1: 'Thanks for voting!',
        line2: allowMultipleVotes
          ? 'Click to select more options or unselect existing votes'
          : 'Click another option to change your vote',
      };
    } else {
      return {
        line1: allowMultipleVotes ? 'Select options' : 'Select an option',
        line2: 'Your vote is recorded instantly',
      };
    }
  };

  // Get status icon based on state
  const getStatusIcon = () => {
    const iconClassName = 'h-4 w-4';
    if (!hasUserName) {
      return <Info className={iconClassName} />;
    } else if (hasVoted && !isEditMode) {
      return <CheckCircle className={iconClassName} />;
    } else if (isEditMode) {
      return <Edit className={iconClassName} />;
    } else {
      return <MousePointer className={iconClassName} />;
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <CardHeader className="flex flex-col items-center justify-center">
      <CardTitle>
        {getStatusIcon()}
        {statusMessage.line1}
      </CardTitle>
      <CardDescription>{statusMessage.line2}</CardDescription>
      {statusMessage.line3 && (
        <CardDescription className="text-xs font-semibold text-destructive">
          {statusMessage.line3}
        </CardDescription>
      )}
    </CardHeader>
  );
}
