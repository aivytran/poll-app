import { AlertCircle } from 'lucide-react';

interface ValidationMessageProps {
  message: string;
  show: boolean;
}

export function ValidationMessage({ message, show }: ValidationMessageProps) {
  if (!show) return null;

  return (
    <div className="flex items-center mt-2 text-destructive text-sm font-medium">
      <AlertCircle className="h-4 w-4 mr-2" />
      {message}
    </div>
  );
}
