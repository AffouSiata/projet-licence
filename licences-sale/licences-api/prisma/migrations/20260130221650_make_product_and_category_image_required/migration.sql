/*
  Warnings:

  - You are about to drop the column `icon` on the `categories` table. All the data in the column will be lost.
  - Made the column `image` on table `categories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "icon",
ALTER COLUMN "image" SET NOT NULL;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "image" SET NOT NULL;
