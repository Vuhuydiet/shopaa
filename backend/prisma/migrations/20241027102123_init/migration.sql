-- AlterTable
ALTER TABLE "Shop" ALTER COLUMN "shopOwnerId" DROP DEFAULT;
DROP SEQUENCE "Shop_shopOwnerId_seq";
