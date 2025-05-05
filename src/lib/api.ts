// =============================================================================
// POLL ENDPOINTS
// =============================================================================

/**
 * Creates a new poll with the given options
 */
export async function createPoll(
  question: string,
  userId: string,
  allowMultipleVotes: boolean,
  options: string[],
  allowVotersToAddOptions: boolean = false
) {
  try {
    const response = await fetch(`/api/polls`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        userId,
        allowMultipleVotes,
        options,
        allowVotersToAddOptions,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create poll: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating poll:', error);
    return null;
  }
}

/**
 * Fetches a poll by its ID
 */
export async function fetchPoll(pollId: string) {
  try {
    const response = await fetch(`/api/polls/${pollId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch poll: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching poll:', error);
    return null;
  }
}

/**
 * Updates a poll with the specified options
 *
 * @param pollId - ID of the poll to update
 * @param options - Array of options with text (and id for existing options)
 * @param token - Admin token for authorization
 * @returns Response with success or error
 */
export async function updatePoll(
  pollId: string,
  options: Array<{ id?: string; text: string }>,
  token: string
) {
  try {
    const response = await fetch(`/api/polls/${pollId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ options, token }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.error || 'Failed to update poll' };
    }

    return {
      success: true,
      createdOptions: data.createdOptions || [],
    };
  } catch (error) {
    console.error('Error updating poll:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// =============================================================================
// POLL OPTION ENDPOINTS
// =============================================================================

/**
 * Creates a new poll option
 */
export async function createPollOption(pollId: string, text: string, token?: string) {
  try {
    const response = await fetch(`/api/polls/${pollId}/options`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, token }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { error: errorData.error || 'Failed to create poll option' };
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating poll option:', error);
    return { error: 'An unexpected error occurred' };
  }
}

// =============================================================================
// VOTE ENDPOINTS
// =============================================================================

/**
 * Fetches votes by user ID, optionally filtered by poll ID
 */
export async function fetchVotesByUserId(userId: string, pollId?: string) {
  try {
    let urlString = `/api/votes?userId=${encodeURIComponent(userId)}`;
    if (pollId) {
      urlString += `&pollId=${encodeURIComponent(pollId)}`;
    }

    const response = await fetch(urlString);

    if (!response.ok) {
      throw new Error(`Failed to fetch user votes: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user votes:', error);
    return { votes: [] };
  }
}

/**
 * Submits a new vote for an option
 */
export async function submitVote(optionId: string, userId: string) {
  try {
    const response = await fetch(`/api/votes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ optionId, userId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to submit vote: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting vote:', error);
    return null;
  }
}

/**
 * Deletes a vote
 */
export async function deleteVote(voteId: string) {
  try {
    const response = await fetch(`/api/votes/${voteId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete vote: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting vote:', error);
    return null;
  }
}

// =============================================================================
// USER ENDPOINTS
// =============================================================================

/**
 * Fetches a user by ID
 */
export async function fetchUser(userId: string) {
  try {
    const response = await fetch(`/api/users/${userId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

/**
 * Updates a user's name
 */
export async function updateUserName(
  userId: string,
  name: string
): Promise<{ id: string; name: string } | null> {
  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update user name: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating user name:', error);
    return null;
  }
}
