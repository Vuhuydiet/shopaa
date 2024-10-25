-- CreateTable
CREATE TABLE "Product" (
    "productId" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "sellerId" INTEGER NOT NULL,
    "quanity" INTEGER NOT NULL DEFAULT 0,
    "currentPrice" INTEGER NOT NULL,
    "originalPrice" INTEGER NOT NULL,
    "brand" TEXT,
    "productDescription" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "numSoldProduct" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "Shop" (
    "shopOwnerId" SERIAL NOT NULL,
    "shopName" TEXT NOT NULL,
    "shopDescription" TEXT,
    "address" TEXT,
    "bankingBalance" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Shop_pkey" PRIMARY KEY ("shopOwnerId")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "Shop"("shopOwnerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_shopOwnerId_fkey" FOREIGN KEY ("shopOwnerId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
