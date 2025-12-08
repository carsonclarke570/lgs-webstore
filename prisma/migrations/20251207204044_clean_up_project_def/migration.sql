/*
  Warnings:

  - You are about to drop the column `lastPriceUpdate` on the `MtgCard` table. All the data in the column will be lost.
  - You are about to drop the column `tcgplayerMarketPrice` on the `MtgCard` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Product_type_isActive_idx";

-- AlterTable
ALTER TABLE "MtgCard" DROP COLUMN "lastPriceUpdate",
DROP COLUMN "tcgplayerMarketPrice";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "isActive";

-- CreateIndex
CREATE INDEX "Product_type_idx" ON "Product"("type");
