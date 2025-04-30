/**
 * Generate a unique ID for poll options
 */
export const uniqueId = () => {
  return `option-${Math.random().toString(36).substring(2, 10)}`;
};

/**
 * Extract initials from a person's name
 * @param name The name to extract initials from
 * @returns Uppercase initials from the name
 */
export const getUserInitials = (name?: string) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};

/**
 * Calculate a percentage for progress bar visualization of votes
 * Ensures a minimum width of 5% and maximum of 100%
 *
 * @param voteCount Number of votes for this option
 * @param maxVotes Maximum number of votes across all options
 * @returns Percentage value between 0-100
 */
export const calculateProgressPercentage = (voteCount: number, maxVotes: number) => {
  return Math.max(0, Math.min(100, (voteCount / maxVotes) * 100));
};
