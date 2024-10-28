-- DropForeignKey
ALTER TABLE "Shop" DROP CONSTRAINT "Shop_shopOwnerId_fkey";

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_shopOwnerId_fkey" FOREIGN KEY ("shopOwnerId") REFERENCES "User"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
