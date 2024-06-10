/*
  Warnings:

  - Added the required column `project_id` to the `transaction_requests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transaction_requests" ADD COLUMN     "project_id" TEXT NOT NULL;
