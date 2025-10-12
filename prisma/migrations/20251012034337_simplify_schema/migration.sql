/*
  Warnings:

  - You are about to drop the column `bankId` on the `patches` table. All the data in the column will be lost.
  - You are about to drop the column `bankSlot` on the `patches` table. All the data in the column will be lost.
  - You are about to drop the `banks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `device_configs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_patch_favorites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "banks" DROP CONSTRAINT "banks_authorId_fkey";

-- DropForeignKey
ALTER TABLE "patches" DROP CONSTRAINT "patches_bankId_fkey";

-- DropForeignKey
ALTER TABLE "user_patch_favorites" DROP CONSTRAINT "user_patch_favorites_patchId_fkey";

-- DropForeignKey
ALTER TABLE "user_patch_favorites" DROP CONSTRAINT "user_patch_favorites_userId_fkey";

-- DropIndex
DROP INDEX "patches_bankId_bankSlot_key";

-- AlterTable
ALTER TABLE "patches" DROP COLUMN "bankId",
DROP COLUMN "bankSlot";

-- DropTable
DROP TABLE "banks";

-- DropTable
DROP TABLE "device_configs";

-- DropTable
DROP TABLE "user_patch_favorites";
