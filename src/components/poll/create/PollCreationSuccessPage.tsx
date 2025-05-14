import { CircleAlert, CircleCheckBig, ScrollText, ShieldUser, UserCircle } from 'lucide-react';
import { useState } from 'react';

import { LinkCard } from '@/components/poll/shared/LinkCard';
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui';
import { usePoll } from '@/hooks/PollContext';

/**
 * Component shown after a poll is successfully created
 */

export function PollCreationSuccessPage({
  resultLinks,
}: {
  resultLinks: { voteLink: string; adminLink: string };
}) {
  const { question, options, settings, resetPoll } = usePoll();
  const [votingCopied, setVotingCopied] = useState(false);
  const [adminCopied, setAdminCopied] = useState(false);

  const handleCopyLink = (linkType: 'voting' | 'admin') => {
    if (!resultLinks) {
      return;
    }

    const link = linkType === 'voting' ? resultLinks.voteLink : resultLinks.adminLink;
    const setStateFn = linkType === 'voting' ? setVotingCopied : setAdminCopied;

    navigator.clipboard.writeText(link);
    setStateFn(true);
    setTimeout(() => {
      setStateFn(false);
    }, 2000);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ScrollText className="h-5 w-5" />
            Poll Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-foreground leading-none space-y-6">
          <div>
            <Badge className="mb-2">Question</Badge>
            <Input value={question} readOnly />
          </div>

          <div className="w-full">
            <Badge className="mb-2">Options</Badge>
            {options.map((option, index) => (
              <div key={option.id} className="flex items-center mb-3 w-full">
                <span className="h-6 w-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-medium mr-3">
                  {index + 1}
                </span>
                <div className="w-full">
                  <Input value={option.text} readOnly />
                </div>
              </div>
            ))}
          </div>

          <div>
            <Badge className="mb-2">Settings</Badge>
            {[
              {
                value: settings.allowMultipleVotes,
                label: 'Multiple votes allowed',
                alt: 'Single vote only',
              },
              {
                value: settings.allowVotersToAddOptions,
                label: 'Voters can add options',
                alt: 'Only admin can add options',
              },
            ].map((setting, index) => (
              <div key={index} className="flex items-center mt-2">
                <CircleCheckBig className="h-4 w-4 mr-2 text-primary" />
                {setting.value ? setting.label : setting.alt}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <LinkCard
        title="Voting Link"
        description="Share this link with your audience to collect votes:"
        icon={<UserCircle className="h-5 w-5 mr-2" />}
        link={resultLinks.voteLink}
        isCopied={votingCopied}
        onCopy={() => handleCopyLink('voting')}
        variant="primary"
      />

      <LinkCard
        title="Admin Link"
        description="Use this link to view results and manage your poll:"
        icon={<ShieldUser className="h-5 w-5 mr-2" />}
        link={resultLinks.adminLink}
        isCopied={adminCopied}
        onCopy={() => handleCopyLink('admin')}
        variant="secondary"
        footer={
          <p className="text-xs text-amber-700 flex items-center mt-3 font-medium">
            <CircleAlert className="h-4 w-4 mr-1.5" />
            Keep this link secure — it provides admin access to your poll
          </p>
        }
      />

      <Button onClick={() => resetPoll()} size="lg">
        Create Another Poll
      </Button>
    </>
  );
}
