/*
  Warnings:

  - You are about to drop the `Storage` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `level` to the `Factory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Factory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Autonomy" DROP CONSTRAINT "Autonomy_id_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_id_fkey";

-- DropForeignKey
ALTER TABLE "State" DROP CONSTRAINT "State_id_fkey";

-- AlterTable
ALTER TABLE "Factory" ADD COLUMN     "level" INTEGER NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL;

-- DropTable
DROP TABLE "Storage";
