import { Plus } from 'lucide-react';

import { Button, Input } from '@/components/ui';
import { useState } from 'react';

interface AddOptionInputProps {
  onAddOption: (text: string) => void;
  isDisabled?: boolean;
}

export function AddOptionInput({ onAddOption, isDisabled = false }: AddOptionInputProps) {
  const [optionText, setOptionText] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSave();
    }
  };

  const onSave = () => {
    if (optionText.trim()) {
      onAddOption(optionText);
      setOptionText('');
    }
  };

  return (
    <div className="grid grid-cols-[1fr_auto] gap-2 px-2 sm:px-4">
      <Input
        value={optionText}
        onChange={e => setOptionText(e.target.value)}
        placeholder="Add a new option..."
        className="bg-primary-foreground"
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
      />
      <Button onClick={onSave} disabled={!optionText.trim() || isDisabled}>
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
}
