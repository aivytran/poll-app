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
import { PollOption } from '@/types/shared';
import { uniqueId } from '@/utils/pollUtils';

interface OptionCardProps {
  options: PollOption[];
  setOptions: (options: PollOption[]) => void;
  hasOptionError: boolean;
  setOptionError: (hasError: boolean) => void;
}

/**
 * Component for managing poll options (add, remove, reorder)
 */
export function OptionCard({
  options,
  setOptions,
  hasOptionError,
  setOptionError,
}: OptionCardProps) {
  const handleAddOption = () => {
    setOptions([...options, { id: uniqueId(), text: '' }]);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) {
      return;
    }
    setOptions(options.filter(option => option.id !== id));
  };

  const handleOptionChange = (newOptions: PollOption[]) => {
    setOptions(newOptions);
    // Clear validation error if all options now have values
    if (hasOptionError && !newOptions.some(opt => !opt.text.trim())) {
      setOptionError(false);
    }
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
        <DragDropOptions
          options={options}
          onChange={handleOptionChange}
          onRemove={handleRemoveOption}
          isOptionDeletable={() => options.length > 2}
          isOptionReadOnly={() => false}
          showError={hasOptionError}
        />
      </CardContent>

      <CardFooter>
        <Button onClick={handleAddOption} variant="outline" className="w-full">
          <Plus />
          Add Option
        </Button>
      </CardFooter>
    </Card>
  );
}
