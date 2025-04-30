import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

function Input({ className, type, error, readOnly, ...props }: InputProps) {
  return (
    <div className="relative">
      <input
        type={type}
        data-slot="input"
        aria-invalid={error}
        readOnly={readOnly}
        className={cn(
          'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-input px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          !readOnly && 'focus-visible:border-ring focus-visible:ring-ring focus-visible:ring-[1px]',
          'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
          className
        )}
        {...props}
      />
    </div>
  );
}

export { Input };
