import { cookies } from 'next/headers';

import { PollContainer } from '@/components/poll/create/PollContainer';

export default async function CreatePollPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')!.value;
  return <PollContainer userId={userId} />;
}
