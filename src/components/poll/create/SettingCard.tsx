import { Settings } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
} from '@/components/ui';
import { usePoll } from '@/context/PollContext';

/**
 * Component for managing poll settings
 */
export function SettingCard() {
  const { settings, setSettings } = usePoll();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Settings className="h-5 w-5" />
          Poll Settings
        </CardTitle>
        <CardDescription>Configure additional options for your poll</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="allowMultipleVotes"
              checked={settings.allowMultipleVotes}
              onCheckedChange={() =>
                setSettings({ ...settings, allowMultipleVotes: !settings.allowMultipleVotes })
              }
            />
            <label htmlFor="allowMultipleVotes" className="text-sm text-foreground leading-none">
              Allow users to vote for multiple options
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="allowVotersToAddOptions"
              checked={settings.allowVotersToAddOptions}
              onCheckedChange={() =>
                setSettings({
                  ...settings,
                  allowVotersToAddOptions: !settings.allowVotersToAddOptions,
                })
              }
            />
            <label
              htmlFor="allowVotersToAddOptions"
              className="text-sm text-foreground leading-none "
            >
              Allow voters to add their own options
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
