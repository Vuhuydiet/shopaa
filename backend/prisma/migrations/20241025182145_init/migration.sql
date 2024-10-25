/*
  Warnings:

  - A unique constraint covering the columns `[providerName,providerUID]` on the table `OAuthProvider` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "OAuthProvider_providerUID_key";

-- CreateIndex
CREATE UNIQUE INDEX "OAuthProvider_providerName_providerUID_key" ON "OAuthProvider"("providerName", "providerUID");
