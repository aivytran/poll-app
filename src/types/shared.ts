// Common option interfaces
export interface PollOption {
  id: string;
  text: string;
  votes?: Vote[];
  order?: number;
  isNew?: boolean;
}

// Common vote-related interfaces
export interface Vote {
  id: string;
  userId?: string;
  voterName?: string;
}

export interface UserVote {
  id: string;
  optionId: string;
}

// Common validation props
export interface ValidationProps {
  error?: boolean;
  showError?: boolean;
}
