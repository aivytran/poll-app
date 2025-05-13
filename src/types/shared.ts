export interface User {
  id: string;
  name: string;
}

export interface PollData {
  id: string;
  question: string;
  pollSettings: PollSettings;
  options: PollOption[];
  adminToken: string;
}

export interface PollOption {
  id: string;
  text: string;
  order?: number;
  isNew?: boolean;
}

export interface PollSettings {
  allowMultipleVotes: boolean;
  allowVotersToAddOptions: boolean;
}

export interface Vote {
  id: string;
  optionId: string;
  voterId: string;
}

export interface User {
  id: string;
  name: string;
}

export interface PollSnapshot {
  poll: PollData;
  votes: Record<string, Vote>;
  users: Record<string, User>;
}
