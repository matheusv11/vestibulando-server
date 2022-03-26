/*
  Warnings:

  - Added the required column `vestibular_id` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "vestibular_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "own_vestibulars" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "timer" INTEGER NOT NULL,

    CONSTRAINT "own_vestibulars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "own_vestibular_questions" (
    "id" SERIAL NOT NULL,
    "own_vestibular_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,

    CONSTRAINT "own_vestibular_questions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_vestibular_id_fkey" FOREIGN KEY ("vestibular_id") REFERENCES "vestibulars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "own_vestibulars" ADD CONSTRAINT "own_vestibulars_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "own_vestibular_questions" ADD CONSTRAINT "own_vestibular_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "own_vestibular_questions" ADD CONSTRAINT "own_vestibular_questions_own_vestibular_id_fkey" FOREIGN KEY ("own_vestibular_id") REFERENCES "own_vestibulars"("id") ON DELETE CASCADE ON UPDATE CASCADE;
