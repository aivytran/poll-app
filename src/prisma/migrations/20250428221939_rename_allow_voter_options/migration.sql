/*
  Warnings:

  - You are about to drop the column `allowVoterOptions` on the `Poll` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Poll" DROP COLUMN "allowVoterOptions",
ADD COLUMN     "allowVotersToAddOptions" BOOLEAN NOT NULL DEFAULT false;
