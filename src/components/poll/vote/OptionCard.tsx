'use client';
import { useState } from 'react';

import { Card } from '@/components/ui';
import { OptionCardEditMode } from './OptionCardEditMode';
import { OptionCardStatusMessage } from './OptionCardStatusMessage';
import { OptionCardVoteMode } from './OptionCardVoteMode';

export function OptionCard() {
  // UI state
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div className="w-full">
      <Card className="w-full">
        <OptionCardStatusMessage isEditMode={isEditMode} />

        {isEditMode ? (
          <OptionCardEditMode onExitEditMode={() => setIsEditMode(false)} />
        ) : (
          <OptionCardVoteMode onEnterEditMode={() => setIsEditMode(true)} />
        )}
      </Card>
    </div>
  );
}
