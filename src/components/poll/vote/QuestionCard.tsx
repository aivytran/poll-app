import { Check, Users } from 'lucide-react';

import { Badge, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui';

interface QuestionCardProps {
  question: string;
  responsesCount: number;
  allowMultipleVotes: boolean;
}

export function QuestionCard({ question, responsesCount, allowMultipleVotes }: QuestionCardProps) {
  return (
    <Card className="flex flex-col items-center justify-center">
      <CardHeader className="w-full flex flex-col items-center">
        <CardTitle>Poll Question</CardTitle>
      </CardHeader>
      <CardContent className="text-center text-xl md:text-2xl font-bold text-foreground leading-tight">
        {question}
      </CardContent>
      <CardFooter>
        <Badge variant="outline" className="border-1 border-primary text-primary font-semibold">
          <Users />
          {responsesCount} {responsesCount === 1 ? 'response' : 'responses'}
        </Badge>

        {allowMultipleVotes && (
          <Badge className="ml-3">
            <Check />
            Multiple choices allowed
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
