'use client';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useState } from 'react';

import { ValidationMessage } from '@/components/ui/ValidationMessage';
import { usePoll } from '@/hooks/PollContext';
import { useOptionHandlers } from '@/hooks/useOptionHandler';
import { PollOption } from '@/types/shared';
import { DragDropOptionItemCard } from './DragDropOptionItemCard';

export function DragDropOptions({
  options,
  setOptions,
}: {
  options: PollOption[];
  setOptions: (options: PollOption[]) => void;
}) {
  const { hasOptionError, setHasOptionError } = usePoll();
  const [activeId, setActiveId] = useState<string | null>(null);

  const { handleChange, handleRemove, handleSingleOptionChange } = useOptionHandlers(
    options,
    setOptions,
    { hasError: hasOptionError, clearError: () => setHasOptionError(false) }
  );

  // Find active option for drag overlay
  const activeOption = activeId ? options.find(o => o.id === activeId) : null;

  // Track which item is being dragged
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // Handle drag end - reorder items
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = options.findIndex(option => option.id === active.id);
      const newIndex = options.findIndex(option => option.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        handleChange(arrayMove(options, oldIndex, newIndex));
      }
    }

    setActiveId(null);
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
    >
      <SortableContext items={options} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {options.map(option => (
            <DragDropOptionItemCard
              key={option.id}
              option={option}
              onChange={handleSingleOptionChange}
              onRemove={handleRemove}
              isDeletable={options.length > 2}
            />
          ))}
        </div>
      </SortableContext>

      {/* Drag overlay - what you see while dragging */}
      <DragOverlay>
        {activeOption && (
          <DragDropOptionItemCard
            option={activeOption}
            isDeletable={options.length > 2}
            isDragOverlay={true}
          />
        )}
      </DragOverlay>
      <ValidationMessage show={hasOptionError} message="All options must have text" />
    </DndContext>
  );
}
