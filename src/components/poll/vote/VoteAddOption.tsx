import { Plus } from 'lucide-react';

import { Button, Input } from '@/components/ui';

interface VoteAddOptionProps {
  value: string;
  onValueChange: (value: string) => void;
  onAddOption: () => void;
  isDisabled?: boolean;
}

export default function VoteAddOption({
  value,
  onValueChange,
  onAddOption,
  isDisabled = false,
}: VoteAddOptionProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && value.trim()) {
      onAddOption();
    }
  };

  return (
    <div className="grid grid-cols-[1fr_auto] gap-2 px-2 sm:px-4">
      <Input
        value={value}
        onChange={e => onValueChange(e.target.value)}
        placeholder="Add a new option..."
        className="bg-primary-foreground"
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
      />
      <Button onClick={onAddOption} disabled={!value.trim() || isDisabled}>
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
}
