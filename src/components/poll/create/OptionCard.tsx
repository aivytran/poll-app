import { ListTodo, Plus } from 'lucide-react';

import { DragDropOptions } from '@/components/poll/shared/DragDropOptions';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import { usePoll } from '@/hooks/PollContext';
import { uniqueId } from '@/utils/pollUtils';

export function OptionCard() {
  const { options, setOptions } = usePoll();

  const addOption = (text: string) => {
    setOptions([...options, { id: uniqueId(), text }]);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <ListTodo className="h-5 w-5" />
          Poll Options
        </CardTitle>
        <CardDescription>Add at least two options for people to choose from</CardDescription>
      </CardHeader>

      <CardContent className="px-2 sm:px-4">
        <DragDropOptions options={options} setOptions={setOptions} />
      </CardContent>

      <CardFooter>
        <Button onClick={() => addOption('')} variant="outline" className="w-full">
          <Plus />
          Add Option
        </Button>
      </CardFooter>
    </Card>
  );
}
