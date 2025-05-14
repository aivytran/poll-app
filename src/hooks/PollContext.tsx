'use client';

import { PollData, PollOption, PollSettings, User, Vote } from '@/types/shared';
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

const PollContext = createContext<PollContext | undefined>(undefined);

export function PollContextProvider({
  initialPoll,
  initialVotes,
  initialUsers,
  initialIsAdmin,
  children,
}: {
  initialPoll?: PollData;
  initialVotes?: Record<string, Vote>;
  initialUsers?: Record<string, User>;
  initialIsAdmin?: boolean;
  children: React.ReactNode;
}) {
  const defaultSettings: PollSettings = {
    allowMultipleVotes: false,
    allowVotersToAddOptions: false,
  };

  const defaultPoll = initialPoll || {
    id: '',
    question: '',
    options: [],
    settings: defaultSettings,
  };

  const [pollId, setPollId] = useState(defaultPoll.id);
  const [question, setQuestion] = useState(defaultPoll.question);
  const [options, setOptions] = useState<PollOption[]>(defaultPoll.options);
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin || false);
  const [settings, setSettings] = useState<PollSettings>({
    allowMultipleVotes: defaultPoll.settings.allowMultipleVotes,
    allowVotersToAddOptions: defaultPoll.settings.allowVotersToAddOptions,
  });
  const [votes, setVotes] = useState<Record<string, Vote>>(initialVotes || {});
  const [users, setUsers] = useState<Record<string, User>>(initialUsers || {});

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
