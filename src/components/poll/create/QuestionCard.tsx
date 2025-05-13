import { HelpCircle } from 'lucide-react';
import React from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, Input } from '@/components/ui';
import { ValidationMessage } from '@/components/ui/ValidationMessage';
import { usePoll } from '@/context/PollContext';

interface QuestionCardProps {
  hasQuestionError: boolean;
  setQuestionError: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Component for the poll question input
 */
export function QuestionCard({ hasQuestionError, setQuestionError }: QuestionCardProps) {
  const { question, setQuestion } = usePoll();

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
