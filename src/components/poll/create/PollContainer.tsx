'use client';
import { useState } from 'react';

import { PageHeader } from '@/components/layout';
import { Button } from '@/components/ui';
import { createPoll } from '@/lib/api';

import { useAuth } from '@/hooks/AuthContext';
import { usePoll } from '@/hooks/PollContext';
import { OptionCard } from './OptionCard';
import { PollCreationSuccessPage } from './PollCreationSuccessPage';
import { QuestionCard } from './QuestionCard';
import { SettingCard } from './SettingCard';

/**
 * Container for creating a new poll with options and settings
 */
export function PollContainer() {
  const { question, options, settings, setHasQuestionError, setHasOptionError } = usePoll();

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultLinks, setResultLinks] = useState(null);

  const validateForm = () => {
    const hasEmptyQuestion = !question.trim();
    const hasEmptyOptions = options.some(option => !option.text.trim());

    setHasQuestionError(hasEmptyQuestion);
    setHasOptionError(hasEmptyOptions);

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
        optionValues,
        settings.allowMultipleVotes,
        settings.allowVotersToAddOptions
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
          <QuestionCard />

          <OptionCard />

          <SettingCard />

          <Button size="lg" variant="default" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Poll'}
          </Button>
        </>
      ) : (
        <PollCreationSuccessPage resultLinks={resultLinks} />
      )}
    </div>
  );
}
