import { useState } from 'react';

import { Button, CardContent, CardFooter } from '@/components/ui';
import { usePoll } from '@/hooks/PollContext';
import { updatePoll } from '@/lib/api';

import { PollOption } from '@/types/shared';
import { uniqueId } from '@/utils/pollUtils';
import { DragDropOptions } from '../shared/DragDropOptions';
import { AddOptionInput } from './AddOptionInput';

// Option format for API updates
type OptionForUpdate = {
  id?: string;
  text: string;
  order: number;
};

export function OptionCardEditMode({ onExitEditMode }: { onExitEditMode: () => void }) {
  const { options, setHasOptionError } = usePoll();

  // Form state
  const [editingOptions, setEditingOptions] = useState<PollOption[]>(options);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validation function
  const validateOptions = (): boolean => {
    const hasEmptyOptions = editingOptions.some(option => !option.text.trim());
    setHasOptionError(hasEmptyOptions);
    return !hasEmptyOptions;
  };

  const handleAddOption = (text: string) => {
    setEditingOptions(prev => [...prev, { id: uniqueId(), text, isNew: true }]);
  };

  // Save changes to the server
  const handleSaveChanges = async () => {
    if (!validateOptions()) {
      return;
    }

    setIsSubmitting(true);
    const { pollId } = usePoll();

    try {
      // Prepare options for the API with correct order
      const optionsForUpdate: OptionForUpdate[] = editingOptions.map((option, index) => ({
        ...(option.isNew ? {} : { id: option.id }),
        text: option.text,
        order: index,
      }));

      const result = await updatePoll(pollId, optionsForUpdate);

      if (result.error) {
        alert(result.error);
      } else {
        onExitEditMode();
      }
    } catch (error) {
      console.error('Error updating options:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CardContent className="w-full space-y-3 mb-3 px-2 sm:px-4">
        <DragDropOptions options={editingOptions} setOptions={setEditingOptions} />

        <AddOptionInput onAddOption={handleAddOption} isDisabled={isSubmitting} />
      </CardContent>

      {/* Action buttons */}
      <CardFooter className="w-full flex gap-3 justify-between px-2 sm:px-4">
        <Button variant="outline" onClick={onExitEditMode} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSaveChanges} disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </>
  );
}
