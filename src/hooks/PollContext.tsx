'use client';

import { PollOption, PollSettings, User, Vote } from '@/types/shared';
import { createContext, useContext, useState } from 'react';

interface PollContext {
  // Poll data
  pollId: string;
  setPollId: (pollId: string) => void;
  question: string;
  setQuestion: (question: string) => void;
  options: PollOption[];
  setOptions: (options: PollOption[]) => void;
  settings: PollSettings;
  setSettings: (settings: PollSettings) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;

  // Vote data
  votes: Record<string, Vote>;
  setVotes: (votes: Record<string, Vote>) => void;
  users: Record<string, User>;
  setUsers: (users: Record<string, User>) => void;

  // Validation state
  hasQuestionError: boolean;
  setHasQuestionError: (hasQuestionError: boolean) => void;
  hasOptionError: boolean;
  setHasOptionError: (hasOptionError: boolean) => void;

  // Actions
  resetPoll: () => void;
}

const defaultSettings: PollSettings = {
  allowMultipleVotes: false,
  allowVotersToAddOptions: false,
};

const PollContext = createContext<PollContext | undefined>(undefined);

export function PollContextProvider({ children }: { children: React.ReactNode }) {
  // Poll data
  const [pollId, setPollId] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<PollOption[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [settings, setSettings] = useState<PollSettings>(defaultSettings);
  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const [users, setUsers] = useState<Record<string, User>>({});

  // Validation state
  const [hasQuestionError, setHasQuestionError] = useState(false);
  const [hasOptionError, setHasOptionError] = useState(false);

  const resetPoll = () => {
    setQuestion('');
    setOptions([]);
    setSettings(defaultSettings);
    setVotes({});
    setUsers({});
  };

  return (
    <PollContext.Provider
      value={{
        pollId,
        setPollId,
        question,
        setQuestion,
        options,
        setOptions,
        settings,
        setSettings,
        isAdmin,
        setIsAdmin,
        votes,
        setVotes,
        users,
        setUsers,
        hasQuestionError,
        setHasQuestionError,
        hasOptionError,
        setHasOptionError,
        resetPoll,
      }}
    >
      {children}
    </PollContext.Provider>
  );
}

export const usePoll = () => {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error('usePoll must be used within a PollContextProvider');
  }
  return context;
};
