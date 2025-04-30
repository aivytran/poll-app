import CreatePollContainer from '@/components/poll/create/CreatePollContainer';
import { cookies } from 'next/headers';

export default async function CreatePollPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')!.value;
  return <CreatePollContainer userId={userId} />;
}
