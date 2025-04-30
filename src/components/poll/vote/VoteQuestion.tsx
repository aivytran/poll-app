import { Badge, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui';
import { Check, Users } from 'lucide-react';

interface VoteQuestionProps {
  question: string;
  responsesCount: number;
  allowMultipleVotes: boolean;
}

export default function VoteQuestion({
  question,
  responsesCount,
  allowMultipleVotes,
}: VoteQuestionProps) {
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
