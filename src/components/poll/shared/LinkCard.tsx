import { CircleCheckBig, Copy } from 'lucide-react';
import { ReactNode } from 'react';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from '@/components/ui';

interface LinkCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  link: string;
  isCopied: boolean;
  onCopy: () => void;
  variant: 'primary' | 'secondary';
  footer?: ReactNode;
}

export function LinkCard({
  title,
  description,
  icon,
  link,
  isCopied,
  onCopy,
  variant = 'primary',
  footer,
}: LinkCardProps) {
  const isPrimary = variant === 'primary';

  const cardClassName = isPrimary ? 'border-blue-200 bg-blue-50' : 'border-amber-200 bg-amber-50';
  const titleClassName = isPrimary ? 'text-blue-700' : 'text-amber-700';
  const buttonClassName = isPrimary
    ? 'bg-blue-600 hover:bg-blue-700'
    : 'bg-amber-600 hover:bg-amber-700';

  return (
    <Card className={cardClassName}>
      <CardHeader>
        <CardTitle className={titleClassName}>
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[1fr_auto]">
          <Input
            value={link}
            readOnly
            className={`border-primary-500 bg-white rounded-r-none border-r-0`}
          />
          <Button onClick={onCopy} className={`${buttonClassName} rounded-l-none`}>
            {isCopied ? (
              <>
                <CircleCheckBig className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
        {footer}
      </CardContent>
    </Card>
  );
}
