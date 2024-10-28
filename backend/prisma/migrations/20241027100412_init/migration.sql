-- CreateTable
CREATE TABLE "ProductCategory" (
    "categoryId" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "ProductImage" (
    "productId" INTEGER NOT NULL,
    "ordinalNumber" INTEGER NOT NULL,
    "URL" TEXT NOT NULL,

    CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("productId","ordinalNumber")
);

-- CreateTable
CREATE TABLE "_ProductToProductCategory" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_categoryName_key" ON "ProductCategory"("categoryName");

-- CreateIndex
CREATE UNIQUE INDEX "ProductImage_ordinalNumber_key" ON "ProductImage"("ordinalNumber");

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToProductCategory_AB_unique" ON "_ProductToProductCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToProductCategory_B_index" ON "_ProductToProductCategory"("B");

-- AddForeignKey
ALTER TABLE "ProductImage" ADD CONSTRAINT "ProductImage_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToProductCategory" ADD CONSTRAINT "_ProductToProductCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToProductCategory" ADD CONSTRAINT "_ProductToProductCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "ProductCategory"("categoryId") ON DELETE CASCADE ON UPDATE CASCADE;
