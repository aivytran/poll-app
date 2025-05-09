'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Lock, Trash2 } from 'lucide-react';

import { Badge, Button, Input } from '@/components/ui';
import { cn } from '@/lib/utils';

// Simplified option interface
export interface DraggableOption {
  id: string;
  value: string;
  votes?: { id: string; userId?: string; voterName?: string }[];
}

// Simplified props
export interface PollOptionItemProps {
  option: DraggableOption;
  onChange?: (id: string, value: string) => void;
  onRemove?: (id: string) => void;
  isReadOnly?: boolean;
  isDeletable?: boolean;
  showVotes?: boolean;
  showError?: boolean;
  isDragOverlay?: boolean;
}

export function PollOptionItem({
  option,
  onChange,
  onRemove,
  isReadOnly = false,
  isDeletable = true,
  showVotes = false,
  showError = false,
  isDragOverlay = false,
}: PollOptionItemProps) {
  // Only use sortable hook if not in overlay mode
  //
  // TODO: Refactor this so we don't call it conditionally.
  const sortableProps = !isDragOverlay
    ? // eslint-disable-next-line react-hooks/rules-of-hooks
      useSortable({
        id: option.id,
        transition: {
          duration: 0,
          easing: 'cubic-bezier(0.2, 0, 0, 1)',
        },
      })
    : null;

  // Styles based on drag state
  const style = !isDragOverlay
    ? {
        transform: sortableProps?.transform
          ? CSS.Transform.toString(sortableProps.transform)
          : undefined,
        transition: undefined,
        zIndex: sortableProps?.isDragging ? 10 : 1,
        opacity: sortableProps?.isDragging ? 0 : 1,
      }
    : { zIndex: 10 };

  // Content of the option (used in both normal and overlay modes)
  const OptionContent = (
    <>
      {/* Drag handle */}
      <div
        {...(!isDragOverlay ? sortableProps?.attributes : {})}
        {...(!isDragOverlay ? sortableProps?.listeners : {})}
        className={cn(
          'h-full flex items-center p-2 rounded-sm text-primary transform-gpu transition-transform duration-200',
          isDragOverlay
            ? 'cursor-grabbing scale-110'
            : 'cursor-grab hover:scale-110 active:scale-110'
        )}
        style={{ touchAction: 'none' }}
        data-drag-handle="true"
      >
        <GripVertical width="24" height="24" />
      </div>

      {/* Option input field */}
      <div className="relative flex-grow">
        <Input
          value={option.value}
          onChange={e => !isReadOnly && onChange?.(option.id, e.target.value)}
          disabled={isReadOnly || isDragOverlay}
          placeholder="Enter an option"
          error={showError && !option.value.trim()}
          className={cn('w-full', isReadOnly && 'pr-8')}
          onClick={e => e.stopPropagation()}
          onTouchStart={e => e.stopPropagation()}
        />

        {isReadOnly && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <Lock width="16" height="16" />
          </div>
        )}
      </div>

      {/* Vote count */}
      {showVotes && option.votes && (
        <Badge variant="secondary" className="mx-2 font-medium text-xs min-w-[20px] text-center">
          {option.votes.length}
        </Badge>
      )}

      {/* Delete button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={e => {
          e.stopPropagation();
          onRemove?.(option.id);
        }}
        disabled={isReadOnly || !isDeletable || isDragOverlay}
        className="p-2 text-muted-foreground"
        onTouchStart={e => e.stopPropagation()}
      >
        <Trash2 width="18" height="18" />
        <span className="sr-only">Remove option</span>
      </Button>
    </>
  );

  // Render different versions based on if it's a draggable item or overlay
  return (
    <div
      ref={!isDragOverlay ? sortableProps?.setNodeRef : undefined}
      style={style}
      className={cn(
        'flex items-center h-14 w-full bg-none',
        isDragOverlay && 'shadow-md rounded-md'
      )}
    >
      {OptionContent}
    </div>
  );
}
