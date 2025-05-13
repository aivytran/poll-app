'use client';

import { PollOption, PollSettings, Vote, Voter } from '@/types/shared';
import { createContext, useContext, useState } from 'react';

interface PollContextType {
  // Poll data
  question: string;
  setQuestion: (question: string) => void;
  options: PollOption[];
  setOptions: (options: PollOption[]) => void;
  settings: PollSettings;
  setSettings: (settings: PollSettings) => void;
  adminToken: string;
  setAdminToken: (token: string) => void;

  // Vote data
  votes: Record<string, Vote>;
  setVotes: (votes: Record<string, Vote>) => void;
  voters: Record<string, Voter>;
  setVoters: (voters: Record<string, Voter>) => void;

  // Actions
  addOption: (text: string) => void;
  removeOption: (id: string) => void;
  resetPoll: () => void;
}

const defaultSettings: PollSettings = {
  allowMultipleVotes: false,
  allowVotersToAddOptions: false,
};

const PollContext = createContext<PollContextType>({
  question: '',
  setQuestion: () => {},
  options: [],
  setOptions: () => {},
  settings: defaultSettings,
  setSettings: () => {},
  adminToken: '',
  setAdminToken: () => {},

  votes: {},
  setVotes: () => {},
  voters: {},
  setVoters: () => {},

  addOption: () => {},
  removeOption: () => {},
  resetPoll: () => {},
});

export function PollProvider({ children }: { children: React.ReactNode }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<PollOption[]>([]);
  const [adminToken, setAdminToken] = useState('');
  const [settings, setSettings] = useState<PollSettings>(defaultSettings);

  const [votes, setVotes] = useState<Record<string, Vote>>({});
  const [voters, setVoters] = useState<Record<string, Voter>>({});

  const addOption = (text: string) => {
    setOptions([...options, { id: crypto.randomUUID(), text }]);
  };

  const removeOption = (id: string) => {
    if (options.length <= 2) {
      return;
    }
    setOptions(options.filter(option => option.id !== id));
  };

  const resetPoll = () => {
    setQuestion('');
    setOptions([]);
    setSettings(defaultSettings);
    setVotes({});
    setVoters({});
  };

  return (
    <PollContext.Provider
      value={{
        question,
        setQuestion,
        options,
        setOptions,
        settings,
        setSettings,
        adminToken,
        setAdminToken,
        votes,
        setVotes,
        voters,
        setVoters,
        addOption,
        removeOption,
        resetPoll,
      }}
    >
      {children}
    </PollContext.Provider>
  );
}

export const usePoll = () => useContext(PollContext);
