import { Check, Users } from 'lucide-react';

import { Badge, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import { usePoll } from '@/hooks/PollContext';

export function QuestionCard() {
  const { question, settings, votes } = usePoll();
  const responsesCount = Object.keys(votes).length;

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

        {settings.allowMultipleVotes && (
          <Badge className="ml-3">
            <Check />
            Multiple choices allowed
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
