/*
  Warnings:

  - The primary key for the `OAuthProvider` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `providerId` on the `OAuthProvider` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[providerUID]` on the table `OAuthProvider` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "OAuthProvider" DROP CONSTRAINT "OAuthProvider_pkey",
DROP COLUMN "providerId",
ADD CONSTRAINT "OAuthProvider_pkey" PRIMARY KEY ("userId", "providerName");

-- CreateIndex
CREATE UNIQUE INDEX "OAuthProvider_providerUID_key" ON "OAuthProvider"("providerUID");
