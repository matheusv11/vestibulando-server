/*
  Warnings:

  - You are about to drop the column `theme_id` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `theme_id` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the `themes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vestibular_themes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `discipline_id` to the `questions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discipline_id` to the `subjects` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_theme_id_fkey";

-- DropForeignKey
ALTER TABLE "subjects" DROP CONSTRAINT "subjects_theme_id_fkey";

-- DropForeignKey
ALTER TABLE "vestibular_themes" DROP CONSTRAINT "vestibular_themes_theme_id_fkey";

-- DropForeignKey
ALTER TABLE "vestibular_themes" DROP CONSTRAINT "vestibular_themes_vestibular_id_fkey";

-- AlterTable
ALTER TABLE "questions" DROP COLUMN "theme_id",
ADD COLUMN     "discipline_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "subjects" DROP COLUMN "theme_id",
ADD COLUMN     "discipline_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "themes";

-- DropTable
DROP TABLE "vestibular_themes";

-- CreateTable
CREATE TABLE "disciplines" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "disciplines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vestibular_disciplines" (
    "id" SERIAL NOT NULL,
    "vestibular_id" INTEGER NOT NULL,
    "discipline_id" INTEGER NOT NULL,

    CONSTRAINT "vestibular_disciplines_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_discipline_id_fkey" FOREIGN KEY ("discipline_id") REFERENCES "disciplines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_discipline_id_fkey" FOREIGN KEY ("discipline_id") REFERENCES "disciplines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vestibular_disciplines" ADD CONSTRAINT "vestibular_disciplines_discipline_id_fkey" FOREIGN KEY ("discipline_id") REFERENCES "disciplines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vestibular_disciplines" ADD CONSTRAINT "vestibular_disciplines_vestibular_id_fkey" FOREIGN KEY ("vestibular_id") REFERENCES "vestibulars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
