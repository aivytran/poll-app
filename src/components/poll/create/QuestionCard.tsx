import { HelpCircle } from 'lucide-react';
import React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@/components/ui';
import { ValidationMessage } from '@/components/ui/ValidationMessage';

interface QuestionCardProps {
  question: string;
  hasQuestionError: boolean;
  setQuestion: React.Dispatch<React.SetStateAction<string>>;
  setQuestionError: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Component for the poll question input
 */
export function QuestionCard({
  question,
  hasQuestionError,
  setQuestion,
  setQuestionError,
}: QuestionCardProps) {
  // Handle input change and validate
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuestion(value);
    if (value.trim()) {
      setQuestionError(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <HelpCircle className="h-5 w-5" />
          Poll Question
        </CardTitle>
        <CardDescription>Enter the main question you want to ask</CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          value={question}
          onChange={handleChange}
          placeholder="e.g., What's your favorite programming language?"
        />
        <ValidationMessage show={hasQuestionError} message="Please enter a question" />
      </CardContent>
    </Card>
  );
}
