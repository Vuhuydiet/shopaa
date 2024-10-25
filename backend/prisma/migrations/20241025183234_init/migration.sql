/*
  Warnings:

  - The primary key for the `OAuthProvider` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "OAuthProvider" DROP CONSTRAINT "OAuthProvider_pkey",
ADD CONSTRAINT "OAuthProvider_pkey" PRIMARY KEY ("userId");
