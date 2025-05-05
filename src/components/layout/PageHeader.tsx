'use client';

import { BarChart2 } from 'lucide-react';

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <Card className="border-none shadow-none bg-transparent py-0">
      <CardHeader className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-sm">
          <BarChart2 className="h-6 w-6 text-primary-foreground" />
        </div>
        <CardTitle className="text-2xl md:text-3xl font-bold text-foreground">{title}</CardTitle>
        {subtitle && (
          <CardDescription className="text-center">
            <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base">
              {subtitle}
            </p>
          </CardDescription>
        )}
      </CardHeader>
    </Card>
  );
}
