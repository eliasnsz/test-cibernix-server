/*
  Warnings:

  - A unique constraint covering the columns `[slug,authorId]` on the table `contents` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `owner_username` to the `contents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contents" ADD COLUMN     "owner_username" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "contents_slug_authorId_key" ON "contents"("slug", "authorId");
