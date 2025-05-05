import { Prisma } from '@prisma/client';

/**
 * Prisma extension to add a computed voterName field to votes
 * This helps display voter names in poll results
 */
export const voteWithUserName = Prisma.defineExtension({
  name: 'voteWithUserName',
  result: {
    vote: {
      voterName: {
        needs: { user: true } as any,
        compute(vote: { user?: { name: string | null } }) {
          return vote.user?.name || 'Anonymous';
        },
      },
    },
  },
});
