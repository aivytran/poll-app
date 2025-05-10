'use client';
import { useState } from 'react';

import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui';
import { createPoll } from '@/lib/api';
import { uniqueId } from '@/utils/pollUtils';

import { useAuth } from '@/context/AuthContext';
import { PollOption } from '@/types/shared';
import { OptionCard } from './OptionCard';
import { PollCreationSuccessPage } from './PollCreationSuccessPage';
import { QuestionCard } from './QuestionCard';
import { SettingCard } from './SettingCard';

/**
 * Container for creating a new poll with options and settings
 */
export function PollContainer() {
  // Form state
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<PollOption[]>([
    { id: uniqueId(), text: '' },
    { id: uniqueId(), text: '' },
  ]);
  const [allowMultipleVotes, setAllowMultipleVotes] = useState(false);
  const [allowVotersToAddOptions, setAllowVotersToAddOptions] = useState(false);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultLinks, setResultLinks] = useState(null);

  // Validation state
  const [questionError, setQuestionError] = useState(false);
  const [optionError, setOptionError] = useState(false);

  // Validation logic extracted to separate function
  const validateForm = () => {
    const hasEmptyQuestion = !question.trim();
    const hasEmptyOptions = options.some(option => !option.text.trim());

    setQuestionError(hasEmptyQuestion);
    setOptionError(hasEmptyOptions);

    return !hasEmptyQuestion && !hasEmptyOptions;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const { userId } = useAuth();

    setIsSubmitting(true);
    try {
      const optionValues = options.map(o => o.text);
      const response = await createPoll(
        question,
        userId,
        allowMultipleVotes,
        optionValues,
        allowVotersToAddOptions
      );

      if (response.error) {
        alert(response.error);
      } else {
        setResultLinks(response.links);
      }
    } catch (error) {
      console.error('Error creating poll:', error);
      alert('An error occurred while creating the poll. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to create another poll
  const handleCreateAnother = () => {
    setQuestion('');
    setOptions([
      { id: uniqueId(), text: '' },
      { id: uniqueId(), text: '' },
    ]);
    setAllowMultipleVotes(false);
    setAllowVotersToAddOptions(false);
    setResultLinks(null);
    setQuestionError(false);
    setOptionError(false);
  };

  // Show success view if poll was created, otherwise show form
  const isPollCreated = resultLinks !== null;

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title={isPollCreated ? 'Poll Created Successfully' : 'Create a New Poll'}
        subtitle={
          isPollCreated
            ? 'Your poll is ready to be shared with others.'
            : 'Create customized polls with multiple options and share them with others to collect votes.'
        }
      />

      {!isPollCreated ? (
        <>
          <QuestionCard
            question={question}
            setQuestion={setQuestion}
            hasQuestionError={questionError}
            setQuestionError={setQuestionError}
          />

          <OptionCard
            options={options}
            setOptions={setOptions}
            hasOptionError={optionError}
            setOptionError={setOptionError}
          />

          <SettingCard
            allowMultipleVotes={allowMultipleVotes}
            allowVotersToAddOptions={allowVotersToAddOptions}
            setAllowMultipleVotes={setAllowMultipleVotes}
            setAllowVotersToAddOptions={setAllowVotersToAddOptions}
          />

          <Button size="lg" variant="default" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Poll'}
          </Button>
        </>
      ) : (
        <PollCreationSuccessPage
          question={question}
          options={options}
          allowMultipleVotes={allowMultipleVotes}
          allowVotersToAddOptions={allowVotersToAddOptions}
          resultLinks={resultLinks}
          onCreateAnother={handleCreateAnother}
        />
      )}
    </div>
  );
}
