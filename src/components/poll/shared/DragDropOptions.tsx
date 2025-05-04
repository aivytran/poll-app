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

import { DraggableOption, PollOptionItem } from './PollOptionItem';

interface DragDropOptionsProps {
  options: DraggableOption[];
  onChange: (options: DraggableOption[]) => void;
  onRemove: (id: string) => void;
  isOptionReadOnly?: (id: string) => boolean;
  isOptionDeletable?: (id: string) => boolean;
  showVotes?: boolean;
  showError?: boolean;
}

function DragDropOptions({
  options,
  onChange,
  onRemove,
  isOptionReadOnly = () => false,
  isOptionDeletable = () => true,
  showVotes = false,
  showError = false,
}: DragDropOptionsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Find active option for drag overlay
  const activeOption = activeId ? options.find(o => o.id === activeId) : null;

  // Handle drag end - reorder items
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = options.findIndex(option => option.id === active.id);
      const newIndex = options.findIndex(option => option.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onChange(arrayMove(options, oldIndex, newIndex));
      }
    }

    setActiveId(null);
  };

  // Track which item is being dragged
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  // Update option text
  const handleSingleOptionChange = (id: string, value: string) => {
    onChange(options.map(option => (option.id === id ? { ...option, value } : option)));
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
            <PollOptionItem
              key={option.id}
              option={option}
              onChange={handleSingleOptionChange}
              onRemove={onRemove}
              isReadOnly={isOptionReadOnly(option.id)}
              isDeletable={isOptionDeletable(option.id)}
              showVotes={showVotes}
              showError={showError && !option.value.trim()}
            />
          ))}
        </div>
      </SortableContext>

      {/* Drag overlay - what you see while dragging */}
      <DragOverlay>
        {activeOption && (
          <PollOptionItem
            option={activeOption}
            isReadOnly={isOptionReadOnly(activeOption.id)}
            isDeletable={isOptionDeletable(activeOption.id)}
            showVotes={showVotes}
            isDragOverlay={true}
          />
        )}
      </DragOverlay>
      <ValidationMessage show={showError} message="All options must have text" />
    </DndContext>
  );
}

export default DragDropOptions;
export type { DraggableOption } from './PollOptionItem';
