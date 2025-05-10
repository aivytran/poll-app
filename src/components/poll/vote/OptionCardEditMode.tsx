import { useMemo, useState } from 'react';

import { Button, CardContent, CardFooter } from '@/components/ui';
import { updatePoll } from '@/lib/api';
import { uniqueId } from '@/utils/pollUtils';

import { DragDropOptionItem } from '../shared/DragDropOptionItemCard';
import { DragDropOptions } from '../shared/DragDropOptions';
import { AddOptionInput } from './AddOptionInput';
import { PollOption } from './OptionCard';

interface OptionCardEditModeProps {
  pollId: string;
  token: string;
  initialOptions: PollOption[];
  onSaveComplete: () => void;
  onCancelEdit: () => void;
}

// Option format for API updates
type OptionForUpdate = {
  id?: string;
  text: string;
  order: number;
};

export function OptionCardEditMode({
  pollId,
  token,
  initialOptions,
  onSaveComplete,
  onCancelEdit,
}: OptionCardEditModeProps) {
  // Form state
  const [editableOptions, setEditableOptions] = useState<PollOption[]>(initialOptions);
  const [newOptionText, setNewOptionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState(false);

  // Convert PollOption[] to DraggableOption[] for the drag-drop component
  const draggableOptions = useMemo(
    () =>
      editableOptions.map(option => ({
        id: option.id,
        value: option.text,
        votes: option.votes,
      })),
    [editableOptions]
  );

  // Validation function
  const validateOptions = (): boolean => {
    const hasEmptyOptions = editableOptions.some(option => !option.text.trim());
    setValidationError(hasEmptyOptions);
    return !hasEmptyOptions;
  };

  // Option handlers
  const handleOptionsChange = (updatedOptions: DragDropOptionItem[]) => {
    // Map DraggableOption back to PollOption
    const newOptions = updatedOptions
      .map(opt => {
        const original = editableOptions.find(o => o.id === opt.id);
        if (!original) {
          return null;
        }
        return {
          ...original,
          text: opt.value,
        };
      })
      .filter(Boolean) as PollOption[];

    setEditableOptions(newOptions);

    // Clear validation error if all options now have values
    if (validationError && !newOptions.some(option => !option.text.trim())) {
      setValidationError(false);
    }
  };

  const handleRemoveOption = (id: string) => {
    const optionToRemove = editableOptions.find(option => option.id === id);
    if (optionToRemove && (optionToRemove.votes?.length || 0) > 0) {
      alert('Cannot remove options that have votes');
      return;
    }

    setEditableOptions(prev => prev.filter(option => option.id !== id));
  };

  const handleAddOption = () => {
    const newPollOption: PollOption = {
      id: uniqueId(),
      text: newOptionText,
      votes: [],
      isNew: true,
    };

    setEditableOptions(prev => [...prev, newPollOption]);
    setNewOptionText('');
  };

  // Save changes to the server
  const handleSaveChanges = async () => {
    if (!validateOptions()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare options for the API with correct order
      const optionsForUpdate: OptionForUpdate[] = editableOptions.map((option, index) => ({
        ...(option.isNew ? {} : { id: option.id }),
        text: option.text,
        order: index,
      }));

      const result = await updatePoll(pollId, optionsForUpdate, token);

      if (result.error) {
        alert(result.error);
      } else {
        onSaveComplete();
      }
    } catch (error) {
      console.error('Error updating options:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper functions for option properties
  const isOptionDeletable = (id: string) => {
    const option = editableOptions.find(o => o.id === id);
    return !option?.votes?.length && editableOptions.length > 2;
  };

  const isOptionReadOnly = (id: string) => {
    const option = editableOptions.find(o => o.id === id);
    return (option?.votes?.length || 0) > 0;
  };

  return (
    <>
      <CardContent className="w-full space-y-3 mb-3 px-2 sm:px-4">
        <DragDropOptions
          options={draggableOptions}
          onChange={handleOptionsChange}
          onRemove={handleRemoveOption}
          isOptionDeletable={isOptionDeletable}
          isOptionReadOnly={isOptionReadOnly}
          showVotes={true}
          showError={validationError}
        />

        <AddOptionInput
          value={newOptionText}
          onValueChange={setNewOptionText}
          onAddOption={handleAddOption}
          isDisabled={isSubmitting}
        />
      </CardContent>

      {/* Action buttons */}
      <CardFooter className="w-full flex gap-3 justify-between px-2 sm:px-4">
        <Button variant="outline" onClick={onCancelEdit} className="flex-1">
          Cancel
        </Button>
        <Button onClick={handleSaveChanges} disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </CardFooter>
    </>
  );
}
