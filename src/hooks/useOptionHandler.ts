import { PollOption } from '@/types/shared';
import { useCallback } from 'react';

/**
 * Builds stable callbacks for editing a list of poll options.
 *
 * @param options     – the array to mutate (can come from Context or useState)
 * @param setOptions  – setter that replaces the array
 * @param opts        – (optional) validation/book-keeping hooks
 */
export function useOptionHandlers(
  options: PollOption[],
  setOptions: (opts: PollOption[]) => void,
  opts?: {
    hasError?: boolean;
    clearError?: () => void;
  }
) {
  // Replace entire list
  const handleChange = useCallback(
    (updated: PollOption[]) => {
      setOptions(updated);

      // auto-clear error only if the caller cares
      if (opts?.hasError && !updated.some(o => !o.text.trim())) {
        opts.clearError?.();
      }
    },
    [setOptions, opts]
  );

  // Delete one option
  const handleRemove = useCallback(
    (id: string) => {
      const newOptions = options.filter((o: PollOption) => o.id !== id);
      setOptions(newOptions);
    },
    [setOptions]
  );

  // Inline text edits
  const handleSingleOptionChange = useCallback(
    (id: string, text: string) =>
      handleChange(options.map(o => (o.id === id ? { ...o, text } : o))),
    [handleChange, options]
  );

  return { handleChange, handleRemove, handleSingleOptionChange };
}
