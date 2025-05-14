import { PollContainer } from '@/components/poll/create/PollContainer';
import { PollContextProvider } from '@/hooks/PollContext';
export default async function CreatePollPage() {
  return (
    <PollContextProvider>
      <PollContainer />
    </PollContextProvider>
  );
}
