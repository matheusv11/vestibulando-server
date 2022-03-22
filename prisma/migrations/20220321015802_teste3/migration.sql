/*
  Warnings:

  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `verified` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "verified" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "questions" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);
