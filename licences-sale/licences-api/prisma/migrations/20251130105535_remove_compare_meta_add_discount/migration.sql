/*
  Warnings:

  - You are about to drop the column `comparePrice` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `metaDesc` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "comparePrice",
DROP COLUMN "metaDesc",
DROP COLUMN "metaTitle",
ADD COLUMN     "discount" INTEGER NOT NULL DEFAULT 0;
