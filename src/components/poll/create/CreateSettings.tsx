import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Checkbox,
} from '@/components/ui';
import { Settings } from 'lucide-react';

interface CreateSettingsProps {
  allowMultipleVotes: boolean;
  allowVotersToAddOptions: boolean;
  setAllowMultipleVotes: (value: boolean) => void;
  setAllowVotersToAddOptions: (value: boolean) => void;
}

/**
 * Component for managing poll settings
 */
export function CreateSettings({
  allowMultipleVotes,
  allowVotersToAddOptions,
  setAllowMultipleVotes: setAllowMultipleVotes,
  setAllowVotersToAddOptions: setAllowVotersToAddOptions,
}: CreateSettingsProps) {
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
              checked={allowMultipleVotes}
              onCheckedChange={setAllowMultipleVotes}
            />
            <label htmlFor="allowMultipleVotes" className="text-sm text-foreground leading-none">
              Allow users to vote for multiple options
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="allowVotersToAddOptions"
              checked={allowVotersToAddOptions}
              onCheckedChange={setAllowVotersToAddOptions}
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
